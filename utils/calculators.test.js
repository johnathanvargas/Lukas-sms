#!/usr/bin/env node
/**
 * Unit tests for calculator utility functions
 */

const { calculateMixAmounts, calculateGranularAmount, extractGranularRate } = require('./calculators.js');

let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✓ ${description}`);
    passed++;
  } catch (e) {
    console.log(`✗ ${description}`);
    console.log(`  Error: ${e.message}`);
    if (e.stack) {
      console.log(`  ${e.stack.split('\n').slice(1, 3).join('\n  ')}`);
    }
    failed++;
  }
}

function assertEquals(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
  }
}

function assertAlmostEqual(actual, expected, tolerance = 0.01, message = '') {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${message}\n  Expected: ${expected} (±${tolerance})\n  Actual: ${actual}`);
  }
}

function assertTrue(condition, message = 'Expected true') {
  if (!condition) {
    throw new Error(message);
  }
}

function assertFalse(condition, message = 'Expected false') {
  if (condition) {
    throw new Error(message);
  }
}

console.log('🧪 Calculator Utils Test Suite\n');
console.log('='.repeat(60));

// ====== Mix Calculator Tests ======
console.log('\n📊 Mix Calculator Tests:');

test('calculateMixAmounts: valid single chemical', () => {
  const result = calculateMixAmounts(25, [
    { id: 'chem1', name: 'Test Chemical', defaultRatePerGallon: 2.5 }
  ]);
  
  assertTrue(result.valid, 'Result should be valid');
  assertEquals(result.tankGallons, 25, 'Tank gallons should match input');
  assertEquals(result.estimatedCoverageSqFt, 25000, 'Coverage should be 25,000 sq ft');
  assertEquals(result.chemicals.length, 1, 'Should have 1 chemical');
  assertAlmostEqual(result.chemicals[0].flOz, 62.5, 0.01, 'Chemical amount should be correct');
  assertAlmostEqual(result.chemicals[0].ml, 1848.125, 0.1, 'ML conversion should be correct');
});

test('calculateMixAmounts: multiple chemicals', () => {
  const result = calculateMixAmounts(50, [
    { id: 'chem1', name: 'Chemical A', defaultRatePerGallon: 1.0 },
    { id: 'chem2', name: 'Chemical B', defaultRatePerGallon: 2.0 }
  ]);
  
  assertTrue(result.valid, 'Result should be valid');
  assertEquals(result.chemicals.length, 2, 'Should have 2 chemicals');
  assertAlmostEqual(result.chemicals[0].flOz, 50.0, 0.01, 'First chemical amount');
  assertAlmostEqual(result.chemicals[1].flOz, 100.0, 0.01, 'Second chemical amount');
});

test('calculateMixAmounts: zero tank size', () => {
  const result = calculateMixAmounts(0, [
    { id: 'chem1', name: 'Test Chemical', defaultRatePerGallon: 2.5 }
  ]);
  
  assertFalse(result.valid, 'Result should be invalid');
  assertTrue(result.error.includes('valid tank size'), 'Should have tank size error');
});

test('calculateMixAmounts: negative tank size', () => {
  const result = calculateMixAmounts(-5, [
    { id: 'chem1', name: 'Test Chemical', defaultRatePerGallon: 2.5 }
  ]);
  
  assertFalse(result.valid, 'Result should be invalid');
});

test('calculateMixAmounts: empty chemicals array', () => {
  const result = calculateMixAmounts(25, []);
  
  assertFalse(result.valid, 'Result should be invalid');
  assertTrue(result.error.includes('at least one chemical'), 'Should have chemicals error');
});

test('calculateMixAmounts: chemical without rate', () => {
  const result = calculateMixAmounts(25, [
    { id: 'chem1', name: 'Test Chemical', mixRate: 'See label' }
  ]);
  
  assertTrue(result.valid, 'Result should still be valid');
  assertEquals(result.chemicals.length, 1, 'Should have 1 chemical');
  assertFalse(result.chemicals[0].hasRate, 'Chemical should not have rate');
  assertTrue(result.chemicals[0].message.includes('label'), 'Should reference label');
});

test('calculateMixAmounts: large tank size', () => {
  const result = calculateMixAmounts(1000, [
    { id: 'chem1', name: 'Test Chemical', defaultRatePerGallon: 0.5 }
  ]);
  
  assertTrue(result.valid, 'Result should be valid');
  assertEquals(result.estimatedCoverageSqFt, 1000000, 'Coverage should be 1,000,000 sq ft');
  assertAlmostEqual(result.chemicals[0].flOz, 500.0, 0.01, 'Chemical amount');
});

test('calculateMixAmounts: decimal rate', () => {
  const result = calculateMixAmounts(10, [
    { id: 'chem1', name: 'Test Chemical', defaultRatePerGallon: 0.125 }
  ]);
  
  assertTrue(result.valid, 'Result should be valid');
  assertAlmostEqual(result.chemicals[0].flOz, 1.25, 0.01, 'Decimal calculation');
});

// ====== Granular Calculator Tests ======
console.log('\n🌾 Granular Calculator Tests:');

test('calculateGranularAmount: valid input', () => {
  const result = calculateGranularAmount(5000, 4.5, 'Test Granular');
  
  assertTrue(result.valid, 'Result should be valid');
  assertEquals(result.areaSqFt, 5000, 'Area should match input');
  assertAlmostEqual(result.areaThousands, 5.0, 0.01, 'Area thousands');
  assertEquals(result.ratePerThousandSqFt, 4.5, 'Rate should match input');
  assertAlmostEqual(result.totalLbs, 22.5, 0.01, 'Total lbs calculation');
  assertEquals(result.productName, 'Test Granular', 'Product name should match');
});

test('calculateGranularAmount: zero area', () => {
  const result = calculateGranularAmount(0, 4.5, 'Test');
  
  assertFalse(result.valid, 'Result should be invalid');
  assertTrue(result.error.includes('valid area'), 'Should have area error');
});

test('calculateGranularAmount: negative area', () => {
  const result = calculateGranularAmount(-100, 4.5, 'Test');
  
  assertFalse(result.valid, 'Result should be invalid');
});

test('calculateGranularAmount: zero rate', () => {
  const result = calculateGranularAmount(5000, 0, 'Test');
  
  assertFalse(result.valid, 'Result should be invalid');
  assertTrue(result.error.includes('application rate'), 'Should have rate error');
});

test('calculateGranularAmount: NaN rate', () => {
  const result = calculateGranularAmount(5000, NaN, 'Test');
  
  assertFalse(result.valid, 'Result should be invalid');
});

test('calculateGranularAmount: no product name', () => {
  const result = calculateGranularAmount(5000, 4.5);
  
  assertTrue(result.valid, 'Result should be valid even without name');
  assertEquals(result.productName, '', 'Product name should be empty string');
});

test('calculateGranularAmount: large area', () => {
  const result = calculateGranularAmount(100000, 3.0, 'Test');
  
  assertTrue(result.valid, 'Result should be valid');
  assertAlmostEqual(result.totalLbs, 300.0, 0.01, 'Large area calculation');
});

test('calculateGranularAmount: decimal rate', () => {
  const result = calculateGranularAmount(2500, 1.75, 'Test');
  
  assertTrue(result.valid, 'Result should be valid');
  assertAlmostEqual(result.totalLbs, 4.375, 0.01, 'Decimal rate calculation');
});

// ====== Rate Extraction Tests ======
console.log('\n🔍 Rate Extraction Tests:');

test('extractGranularRate: from defaultGranularRatePerThousandSqFt', () => {
  const rate = extractGranularRate({
    defaultGranularRatePerThousandSqFt: 5.5
  });
  
  assertEquals(rate, 5.5, 'Should extract from default field');
});

test('extractGranularRate: from mixRate string', () => {
  const rate = extractGranularRate({
    mixRate: 'Apply 3.5 lbs per 1,000 sq ft'
  });
  
  assertEquals(rate, 3.5, 'Should extract number from string');
});

test('extractGranularRate: prefer default over mixRate', () => {
  const rate = extractGranularRate({
    defaultGranularRatePerThousandSqFt: 5.5,
    mixRate: 'Apply 3.5 lbs per 1,000 sq ft'
  });
  
  assertEquals(rate, 5.5, 'Should prefer default field');
});

test('extractGranularRate: null for no rate', () => {
  const rate = extractGranularRate({
    name: 'Chemical'
  });
  
  assertEquals(rate, null, 'Should return null when no rate found');
});

test('extractGranularRate: null for empty object', () => {
  const rate = extractGranularRate({});
  
  assertEquals(rate, null, 'Should return null for empty object');
});

test('extractGranularRate: null for null input', () => {
  const rate = extractGranularRate(null);
  
  assertEquals(rate, null, 'Should return null for null input');
});

// ====== Summary ======
console.log('\n' + '='.repeat(60));
console.log(`\n✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total: ${passed + failed}\n`);

process.exit(failed > 0 ? 1 : 0);
