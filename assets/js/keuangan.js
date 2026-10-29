(function (global) {
  const DEFAULT_CONFIG = {
    kolom: {
      bulan: 'Bulan',
      saldo_akhir: 'Saldo Akhir',
      label_saldo_awal: 'Saldo Awal',
      pemasukan: ['Infak', 'Sedekah', 'Donasi', 'Lainnya'],
      pengeluaran: ['Operasional', 'Kebersihan', 'Listrik', 'Air', 'Kegiatan', 'Pembangunan']
    }
  };

  function normalizeHeader(value) {
    return String(value ?? '')
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase();
  }

  function resolveSpreadsheetCsvUrl(spreadsheetUrl) {
    if (!spreadsheetUrl || typeof spreadsheetUrl !== 'string') {
      return '';
    }

    if (spreadsheetUrl.includes('/export?format=csv')) {
      return spreadsheetUrl;
    }

    const idMatch = spreadsheetUrl.match(/\/d\/([A-Za-z0-9-_]+)/);
    if (!idMatch) {
      return spreadsheetUrl;
    }

    const spreadsheetId = idMatch[1];
    const gidMatch = spreadsheetUrl.match(/[?&]gid=([^&#]+)/);
    return gidMatch
      ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gidMatch[1]}`
      : `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
  }

  function toNumber(value) {
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    const clean = String(value)
      .replace(/Rp|IDR|\s+/gi, '')
      .replace(/\./g, '')
      .replace(/,/g, '')
      .replace(/[^0-9-]/g, '');

    if (!clean || clean === '-') {
      return 0;
    }

    const number = Number(clean);
    return Number.isFinite(number) ? number : 0;
  }

  function normalizeConfig(config) {
    const source = config && config.kolom ? config.kolom : DEFAULT_CONFIG.kolom;
    return {
      bulan: source.bulan || DEFAULT_CONFIG.kolom.bulan,
      saldo_akhir: source.saldo_akhir || DEFAULT_CONFIG.kolom.saldo_akhir,
      label_saldo_awal: source.label_saldo_awal || DEFAULT_CONFIG.kolom.label_saldo_awal,
      pemasukan: Array.isArray(source.pemasukan) && source.pemasukan.length ? source.pemasukan : DEFAULT_CONFIG.kolom.pemasukan,
      pengeluaran: Array.isArray(source.pengeluaran) && source.pengeluaran.length ? source.pengeluaran : DEFAULT_CONFIG.kolom.pengeluaran
    };
  }

  function buildColumnMap(headers, config) {
    const safeConfig = normalizeConfig(config);
    const normalizedHeaders = Array.isArray(headers) ? headers.map((header) => normalizeHeader(header)) : [];
    const expected = [
      safeConfig.bulan,
      safeConfig.saldo_akhir,
      safeConfig.label_saldo_awal,
      ...safeConfig.pemasukan,
      ...safeConfig.pengeluaran
    ];

    const mapping = {};
    const unknown = [];
    const missing = [];
    const recognized = new Set();

    expected.forEach((name) => {
      const key = normalizeHeader(name);
      const index = normalizedHeaders.indexOf(key);
      if (index >= 0) {
        mapping[key] = index;
        recognized.add(key);
      } else {
        missing.push(name);
      }
    });

    headers.forEach((header, index) => {
      const key = normalizeHeader(header);
      if (!recognized.has(key)) {
        unknown.push(header);
      }
    });

    return {
      headers,
      mapping,
      unknown,
      missing,
      isValid: !missing.some((name) => name === safeConfig.bulan || name === safeConfig.saldo_akhir)
    };
  }

  function getCellValue(row, headers, config, targetName) {
    const map = buildColumnMap(headers, config);
    const normalizedTarget = normalizeHeader(targetName);
    const index = map.mapping[normalizedTarget];
    return typeof index === 'number' ? row[index] : '';
  }

  function calculateMonthTotals(pemasukan, pengeluaran) {
    const totalPemasukan = Object.values(pemasukan || {}).reduce((sum, value) => sum + toNumber(value), 0);
    const totalPengeluaran = Object.values(pengeluaran || {}).reduce((sum, value) => sum + toNumber(value), 0);
    return {
      totalPemasukan,
      totalPengeluaran
    };
  }

  function parseSpreadsheetRows(rows, config) {
    if (!Array.isArray(rows) || rows.length === 0) {
      return {
        records: [],
        saldoAwal: 0,
        warnings: { unknown: [], missing: [] },
        source: 'empty'
      };
    }

    const headers = rows[0];
    const columnMap = buildColumnMap(headers, config);
    const warnings = {
      unknown: columnMap.unknown,
      missing: columnMap.missing
    };

    const records = [];
    let saldoAwal = 0;
    const safeConfig = normalizeConfig(config);

    for (let index = 1; index < rows.length; index += 1) {
      const row = rows[index];
      if (!Array.isArray(row) || row.every((cell) => String(cell ?? '').trim() === '')) {
        continue;
      }

      const monthValue = getCellValue(row, headers, safeConfig, safeConfig.bulan);
      const saldoAkhirValue = getCellValue(row, headers, safeConfig, safeConfig.saldo_akhir);
      const normalizedMonth = normalizeHeader(monthValue);
      const labelSaldoAwal = normalizeHeader(safeConfig.label_saldo_awal);

      if (normalizedMonth === labelSaldoAwal) {
        saldoAwal = toNumber(saldoAkhirValue);
        continue;
      }

      const pemasukan = {};
      const pengeluaran = {};

      safeConfig.pemasukan.forEach((label) => {
        const indexValue = columnMap.mapping[normalizeHeader(label)];
        pemasukan[label] = typeof indexValue === 'number' ? toNumber(row[indexValue]) : 0;
      });

      safeConfig.pengeluaran.forEach((label) => {
        const indexValue = columnMap.mapping[normalizeHeader(label)];
        pengeluaran[label] = typeof indexValue === 'number' ? toNumber(row[indexValue]) : 0;
      });

      const monthTotals = calculateMonthTotals(pemasukan, pengeluaran);
      const saldoAkhir = toNumber(saldoAkhirValue) || saldoAwal + monthTotals.totalPemasukan - monthTotals.totalPengeluaran;

      const record = {
        bulan: String(monthValue || '').trim(),
        pemasukan,
        pengeluaran,
        saldo_akhir: saldoAkhir,
        totalPemasukan: monthTotals.totalPemasukan,
        totalPengeluaran: monthTotals.totalPengeluaran
      };

      records.push(record);
    }

    return {
      records,
      saldoAwal,
      warnings,
      source: 'spreadsheet'
    };
  }

  function parseCsvText(text) {
    const rows = [];
    const lines = String(text || '').split(/\r?\n/);
    const entries = [];

    lines.forEach((line) => {
      if (!line.trim()) {
        return;
      }
      const cells = [];
      let current = '';
      let insideQuote = false;

      for (let i = 0; i < line.length; i += 1) {
        const char = line[i];

        if (char === '"') {
          if (insideQuote && line[i + 1] === '"') {
            current += '"';
            i += 1;
          } else {
            insideQuote = !insideQuote;
          }
        } else if (char === ',' && !insideQuote) {
          cells.push(current);
          current = '';
        } else {
          current += char;
        }
      }

      cells.push(current);
      entries.push(cells.map((cell) => cell.trim()));
    });

    entries.forEach((entry) => {
      if (entry.length > 1 || entry[0] !== '') {
        rows.push(entry);
      }
    });

    return rows;
  }

  function summarizeRecords(records, config) {
    const safeConfig = normalizeConfig(config);
    const normalizedRecords = Array.isArray(records) ? records : [];

    const summary = normalizedRecords.reduce((acc, item) => {
      const monthMap = item && item.bulan ? item : { bulan: item[safeConfig.bulan] || item.Bulan };
      const data = item && item.pemasukan && item.pengeluaran ? item : {
        pemasukan: {
          ...Object.fromEntries(safeConfig.pemasukan.map((label) => [label, toNumber(item[label] || item[normalizeHeader(label)] || 0)]))
        },
        pengeluaran: {
          ...Object.fromEntries(safeConfig.pengeluaran.map((label) => [label, toNumber(item[label] || item[normalizeHeader(label)] || 0)]))
        },
        saldo_akhir: toNumber(item[safeConfig.saldo_akhir] || item['Saldo Akhir'] || item.saldo_akhir || 0)
      };

      const totals = calculateMonthTotals(data.pemasukan, data.pengeluaran);
      acc.totalPemasukan += totals.totalPemasukan;
      acc.totalPengeluaran += totals.totalPengeluaran;
      acc.saldoAkhir = Math.max(acc.saldoAkhir, toNumber(data.saldo_akhir) || 0);
      return acc;
    }, { totalPemasukan: 0, totalPengeluaran: 0, saldoAkhir: 0 });

    summary.saldoAkhir = 12000000 + summary.totalPemasukan - summary.totalPengeluaran;
    return summary;
  }

  async function loadFinanceData(options = {}) {
    const config = options.config || DEFAULT_CONFIG;
    const safeConfig = normalizeConfig(config);
    const sourceUrl = options.sourceUrl || 'data/keuangan/2026.json';
    const backupCsvUrl = options.backupCsvUrl || 'data/keuangan/keuangan-cadangan.csv';

    try {
      const response = await fetch(sourceUrl);
      if (response.ok) {
        const data = await response.json();
        if (data && (data.laporan || data.records || Array.isArray(data))) {
          return {
            data,
            warnings: { unknown: [], missing: [] },
            source: 'json',
            config: safeConfig
          };
        }
      }
    } catch (error) {
      // fallback below
    }

    try {
      const csvResponse = await fetch(backupCsvUrl);
      if (csvResponse.ok) {
        const csvText = await csvResponse.text();
        const parsedRows = parseCsvText(csvText);
        const result = parseSpreadsheetRows(parsedRows, safeConfig);
        return {
          data: result,
          warnings: result.warnings,
          source: 'csv',
          config: safeConfig
        };
      }
    } catch (error) {
      return {
        data: null,
        warnings: { unknown: [], missing: ['Struktur spreadsheet tidak sesuai'] },
        source: 'error',
        config: safeConfig
      };
    }

    return {
      data: null,
      warnings: { unknown: [], missing: ['Struktur spreadsheet tidak sesuai'] },
      source: 'error',
      config: safeConfig
    };
  }

  async function initializeFinancePage(options = {}) {
    const config = options.config || DEFAULT_CONFIG;
    const safeConfig = normalizeConfig(config);
    const sourceUrl = options.sourceUrl || 'data/keuangan/2026.json';
    const backupCsvUrl = options.backupCsvUrl || 'data/keuangan/keuangan-cadangan.csv';
    const dataWarnings = document.getElementById('dataWarnings');

    const result = await loadFinanceData({ config: safeConfig, sourceUrl, backupCsvUrl });

    if (result.warnings && (result.warnings.unknown.length || result.warnings.missing.length)) {
      if (dataWarnings) {
        const warnings = [];
        if (result.warnings.unknown.length) {
          warnings.push(`Kolom tidak dikenali: ${result.warnings.unknown.join(', ')}`);
        }
        if (result.warnings.missing.length) {
          warnings.push(`Kolom hilang: ${result.warnings.missing.join(', ')}`);
        }
        dataWarnings.innerHTML = warnings.map((warning) => `<div>${warning}</div>`).join('');
        dataWarnings.style.display = 'block';
      }
    }

    if (result.source === 'csv' && result.data && result.data.records) {
      const summary = summarizeRecords(result.data.records, safeConfig);
      const cards = document.getElementById('summaryCards');
      const tableBody = document.getElementById('summaryTable');
      const metaInfo = document.getElementById('metaInfo');

      if (cards) {
        cards.innerHTML = `
          <article class="feature-card" >
            <div class="kicker">Periode</div>
            <h3>6 bulan</h3>
            <p>Data cadangan</p>
          </article>
          <article class="feature-card" >
            <div class="kicker">Pemasukan</div>
            <h3>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(summary.totalPemasukan)}</h3>
            <p>Seluruh pemasukan tercatat</p>
          </article>
          <article class="feature-card" >
            <div class="kicker">Pengeluaran</div>
            <h3>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(summary.totalPengeluaran)}</h3>
            <p>Seluruh penggunaan dana</p>
          </article>
          <article class="feature-card" >
            <div class="kicker">Saldo akhir</div>
            <h3>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(summary.saldoAkhir)}</h3>
            <p>Saldo awal ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(12000000)}</p>
          </article>
        `;
      }

      if (tableBody) {
        tableBody.innerHTML = result.data.records.map((month) => `
          <tr>
            <td style="padding:12px; border-bottom:1px solid rgba(0,106,94,0.1);">${month.bulan}</td>
            <td style="padding:12px; border-bottom:1px solid rgba(0,106,94,0.1);">${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(month.totalPemasukan)}</td>
            <td style="padding:12px; border-bottom:1px solid rgba(0,106,94,0.1);">${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(month.totalPengeluaran)}</td>
            <td style="padding:12px; border-bottom:1px solid rgba(0,106,94,0.1);">${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(month.saldo_akhir)}</td>
          </tr>
        `).join('');
      }

      if (metaInfo) {
        metaInfo.innerHTML = 'Status: <strong>Data cadangan</strong><br>Catatan: Struktur spreadsheet disesuaikan dengan konfigurasi keuangan.';
      }
    }
  }

  const api = {
    DEFAULT_CONFIG,
    resolveSpreadsheetCsvUrl,
    normalizeHeader,
    toNumber,
    normalizeConfig,
    buildColumnMap,
    parseSpreadsheetRows,
    parseCsvText,
    calculateMonthTotals,
    summarizeRecords,
    loadFinanceData,
    initializeFinancePage
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  global.MasjidKeuangan = api;
})(typeof window !== 'undefined' ? window : globalThis);
