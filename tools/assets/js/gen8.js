// script.js – Versi FIX untuk semua uji statistik (tanpa ANOVA)

// Global variables
let chartInstance = null;
if (typeof ChartDataLabels !== 'undefined') {
  }
let __csvData = [];

// ===============================
// CSV Upload
// ===============================
document.getElementById("csvFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete(r) {
      __csvData = r.data.filter(row => Object.values(row).some(val => val !== null && val !== ''));
      const keys = Object.keys(r.data[0]);
      const c1 = document.getElementById("col1Select"),
            c2 = document.getElementById("col2Select");
      c1.innerHTML = "";
      c2.innerHTML = "";
      keys.forEach((k) => {
        c1.add(new Option(k, k));
        c2.add(new Option(k, k));
      });
      document.getElementById("columnSelector").style.display = "block";
    },
    error(err) {
      alert("Gagal membaca file CSV: " + err.message);
    }
  });
});

function useSelectedColumns() {
  const c1 = document.getElementById("col1Select").value;
  const c2 = document.getElementById("col2Select").value;
  const v1 = __csvData.map((r) => r[c1]).filter((v) => typeof v === "number");
  const v2 = __csvData.map((r) => r[c2]).filter((v) => typeof v === "number");
  document.getElementById("data1").value = v1.join(",");
  document.getElementById("data2").value = v2.join(",");
}


// ===============================
// Fungsi Tambahan: tInv (inverse distribusi t)
function tInv(p, df) {
  // Approximation using inverse beta distribution
  const x = betaIncInv(2 * Math.min(p, 1 - p), df / 2, 0.5);
  const t = Math.sqrt(df * (1 - x) / x);
  return p > 0.5 ? t : -t;
}

function betaIncInv(p, a, b) {
  // Newton-Raphson method for inverse of betaInc
  let x = 0.5;
  for (let i = 0; i < 10; i++) {
    const error = betaInc(x, a, b) - p;
    if (Math.abs(error) < 1e-6) return x;
    const dx = 1e-6;
    const deriv = (betaInc(x + dx, a, b) - betaInc(x - dx, a, b)) / (2 * dx);
    x -= error / deriv;
    x = Math.max(0.0001, Math.min(0.9999, x));
  }
  return x;
}

// ===============================
// Utility: Distribusi Statistik Manual
// ===============================
function gamma(x) {
  const p = [
    676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012,
    9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  const g = 7;
  if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x));
  x -= 1;
  let a = 0.99999999999980993;
  for (let i = 0; i < p.length; i++) a += p[i] / (x + i + 1);
  const t = x + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
}
function gammaLn(x) {
  return Math.log(gamma(x));
}
function betacf(x, a, b) {
  let m2,
    aa,
    c = 1,
    d = 1 - ((a + b) * x) / (a + 1),
    h = 1 / d;
  for (let m = 1; m < 100; m++) {
    m2 = 2 * m;
    aa = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    h *= d / c;
    aa = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    const del = d / c;
    h *= del;
    if (Math.abs(del - 1) < 1e-7) break;
  }
  return h;
}
function betaInc(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(
    gammaLn(a + b) - gammaLn(a) - gammaLn(b) +
    a * Math.log(x) + b * Math.log(1 - x)
  );
  if (x < (a + 1) / (a + b + 2)) return (bt * betacf(x, a, b)) / a;
  else return 1 - (bt * betacf(1 - x, b, a)) / b;
}

function tDistCDF(t, df) {
  const x = df / (t * t + df);
  return 1 - 0.5 * betaInc(x, df / 2, 0.5);
}
function erf(x) {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741;
  const a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}
function zCDF(z) {
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
}
function fDistCDF(F, df1, df2) {
  if (F <= 0) return 0;
  const x = (df1 * F) / (df1 * F + df2);
  const result = betaInc(x, df1 / 2, df2 / 2);
  return result;
}

// ===============================
// Fungsi Uji Statistik
// ===============================
function pairedTTest(d1, d2) {
  const diffs = d1.map((v, i) => v - d2[i]);
  const meanDiff = ss.mean(diffs);
  const stdDiff = ss.standardDeviation(diffs);
  const n = diffs.length;
  const t = meanDiff / (stdDiff / Math.sqrt(n));
  const df = n - 1;
  const p = 2 * (1 - tDistCDF(Math.abs(t), df));
  return {
    text: `Uji-t Berpasangan\n------------------------\nn=${n}, df=${df}\nmean diff=${meanDiff.toFixed(4)}\nt=${t.toFixed(4)}\np=${p.toFixed(4)}\n${p < 0.05 ? "✅ Signifikan" : "⚠️ Tidak signifikan"}`,
    p,
  };
}
function independentTTest(d1, d2) {
  const n1 = d1.length, n2 = d2.length;
  const m1 = ss.mean(d1), m2 = ss.mean(d2);
  const v1 = ss.variance(d1), v2 = ss.variance(d2);
  const se = Math.sqrt(v1 / n1 + v2 / n2);
  const t = (m1 - m2) / se;
  const df = Math.pow(v1 / n1 + v2 / n2, 2) /
    (Math.pow(v1 / n1, 2) / (n1 - 1) + Math.pow(v2 / n2, 2) / (n2 - 1));
  const p = 2 * (1 - tDistCDF(Math.abs(t), Math.floor(df)));
  return {
    text: `Uji-t Independen\n------------------------\nn1=${n1}, mean1=${m1.toFixed(2)}, n2=${n2}, mean2=${m2.toFixed(2)}\ndf=${Math.floor(df)}, t=${t.toFixed(4)}\np=${p.toFixed(4)}\n${p < 0.05 ? "✅ Signifikan" : "⚠️ Tidak signifikan"}`,
    p,
  };
}
function pearsonCorrelation(d1, d2) {
  const r = ss.sampleCorrelation(d1, d2);
  const n = d1.length;
  const t = r * Math.sqrt((n - 2) / (1 - r * r));
  const p = 2 * (1 - tDistCDF(Math.abs(t), n - 2));
  return {
    text: `Korelasi Pearson\n------------------------\nr=${r.toFixed(4)}\nt=${t.toFixed(4)}, df=${n - 2}\np=${p.toFixed(4)}\n${p < 0.05 ? "✅ Signifikan" : "⚠️ Tidak signifikan"}`,
    p,
  };
}
function mannWhitneyTest(d1, d2) {
  const combined = [...d1.map((v) => [v, "A"]), ...d2.map((v) => [v, "B"])]
    .sort((a, b) => a[0] - b[0]);
  let ranks = [];
  for (let i = 0; i < combined.length;) {
    const val = combined[i][0];
    const same = combined.filter((x) => x[0] === val);
    const avg = (2 * i + same.length + 1) / 2;
    same.forEach((_) => ranks.push([combined[i][1], avg]));
    i += same.length;
  }
  const R1 = ranks.filter((r) => r[0] === "A").reduce((s, x) => s + x[1], 0);
  const n1 = d1.length, n2 = d2.length;
  const U = Math.min(
    n1 * n2 + (n1 * (n1 + 1)) / 2 - R1,
    n1 * n2 - (n1 * n2 + (n1 * (n1 + 1)) / 2 - R1)
  );
  const mu = (n1 * n2) / 2;
  const sigma = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);
  const z = (U - mu) / sigma;
  const p = 2 * (1 - zCDF(Math.abs(z)));
  return {
    text: `Mann-Whitney U\n------------------------\nU=${U.toFixed(4)}, z=${z.toFixed(4)}\np≈${p.toFixed(4)}\n${p < 0.05 ? "✅ Signifikan" : "⚠️ Tidak signifikan"}`,
    p,
  };
}
function chiSquareTest() {
  const raw = prompt("Masukkan tabel kontingensi (baris ENTER, kolom spasi):\nContoh:\n10 20\n15 25");
  if (!raw) return null;
  const rows = raw.trim().split("\n").map((r) => r.trim().split(/\s+/).map(Number));
  const rowSums = rows.map((r) => r.reduce((a, b) => a + b, 0));
  const colSums = rows[0].map((_, j) => rows.reduce((s, r) => s + r[j], 0));
  const total = rowSums.reduce((a, b) => a + b, 0);
  let chi2 = 0;
  rows.forEach((r, i) =>
    r.forEach((v, j) => {
      const e = (rowSums[i] * colSums[j]) / total;
      chi2 += (v - e) ** 2 / e;
    })
  );
  const df = (rows.length - 1) * (rows[0].length - 1);
  const p = 1 - fDistCDF(chi2, 1, df); // approx
  return {
    text: `Chi-Square\n------------------------\nχ²=${chi2.toFixed(4)}, df=${df}\np=${p.toFixed(4)}\n${p < 0.05 ? "✅ Signifikan" : "⚠️ Tidak signifikan"}`,
    p,
  };
}
// ===============================
// Jalankan Uji
// ===============================
function runTest() {
  const summary = document.getElementById("summaryBox");
  summary.innerText = "";
  const type = document.getElementById("uji").value;
  const d1 = document.getElementById("data1").value.split(",").map(Number);
  const d2 = document.getElementById("data2").value.split(",").map(Number);
  const out = document.getElementById("resultBox");
  function summarize(data, label) {
    const n = data.length;
    const mean = ss.mean(data).toFixed(2);
    const median = ss.median(data).toFixed(2);
    const sd = ss.standardDeviation(data).toFixed(2);
    const variance = ss.variance(data).toFixed(2);
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    return `📊 Ringkasan ${label}:
n = ${n}
min = ${min}
max = ${max}
mean = ${mean}
median = ${median}
std dev = ${sd}
variance = ${variance}
range = ${range}`;
  }
  document.getElementById("exportButtons").style.display = "none";

  let res;
  if (type === "paired") res = pairedTTest(d1, d2);
  else if (type === "independent") res = independentTTest(d1, d2);
  else if (type === "correlation") res = pearsonCorrelation(d1, d2);
  else if (type === "mannwhitney") res = mannWhitneyTest(d1, d2);
  else if (type === "chisquare") res = chiSquareTest();

  summary.innerText = summarize(d1, "Data 1") + "\n\n" + summarize(d2, "Data 2");
  out.innerText = res?.text || "Gagal menjalankan uji.";

  // Tambahkan interpretasi p-value
  if (res?.p !== undefined) {
  
}
  document.getElementById("exportButtons").style.display = "block";
}



// pastikan fungsi ini berada di global scope
document.getElementById("exportButtons").style.display = "block";


// pastikan fungsi ini berada di global scope
window.runTest = runTest;

