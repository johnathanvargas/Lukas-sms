/**
 * Pure calculation functions for Mix Calculator and Granular Helper
 * These functions are extracted for reusability and testability
 */

/**
 * Calculate mix amounts for a tank of chemicals
 * @param {number} tankGallons - Tank size in gallons
 * @param {Array<{id: string, defaultRatePerGallon: number, name: string, mixRate?: string}>} chemicals - Array of chemical objects with rates
 * @returns {Object} Calculation results with tank info and chemical amounts
 */
function calculateMixAmounts(tankGallons, chemicals) {
  const FL_OZ_TO_ML = 29.57;
  const SPRAY_VOLUME_PER_1000_SQFT = 1; // Fixed: 1 gal per 1,000 sq ft

  // Validate inputs
  if (!tankGallons || tankGallons <= 0) {
    return {
      error: "Enter a valid tank size in gallons.",
      valid: false
    };
  }

  if (!Array.isArray(chemicals) || chemicals.length === 0) {
    return {
      error: "Select at least one chemical.",
      valid: false
    };
  }

  // Calculate coverage
  const estimatedCoverageSqFt = tankGallons * 1000;

  // Calculate amounts for each chemical
  const mixItems = [];
  const chemicalResults = [];

  chemicals.forEach(chem => {
    if (!chem) return;

    // Check if chemical has a valid rate
    if (typeof chem.defaultRatePerGallon !== "number" || chem.defaultRatePerGallon <= 0) {
      const labelRate = chem.mixRate
        ? `Label mix rate: ${chem.mixRate}`
        : "Check the product label for exact rates.";
      
      chemicalResults.push({
        id: chem.id,
        name: chem.name,
        message: labelRate,
        hasRate: false
      });
      return;
    }

    // Calculate amounts
    const flOz = chem.defaultRatePerGallon * tankGallons;
    const ml = flOz * FL_OZ_TO_ML;

    chemicalResults.push({
      id: chem.id,
      name: chem.name,
      flOz: flOz,
      ml: ml,
      ratePerGallon: chem.defaultRatePerGallon,
      hasRate: true
    });

    mixItems.push({
      id: chem.id,
      name: chem.name,
      ratePerGallon: chem.defaultRatePerGallon,
      flOz,
      ml
    });
  });

  return {
    valid: true,
    tankGallons,
    sprayVolume: SPRAY_VOLUME_PER_1000_SQFT,
    estimatedCoverageSqFt,
    chemicals: chemicalResults,
    mixItems,
    mixText: mixItems
      .map(item => `${item.name}: ${item.flOz.toFixed(2)} fl oz (~${item.ml.toFixed(0)} mL) at ${item.ratePerGallon} fl oz/gal`)
      .join('\n')
  };
}

/**
 * Calculate granular product needed for an area
 * @param {number} areaSqFt - Area to treat in square feet
 * @param {number} ratePerThousandSqFt - Application rate in lbs per 1,000 sq ft
 * @param {string} productName - Name of the product (optional)
 * @returns {Object} Calculation results
 */
function calculateGranularAmount(areaSqFt, ratePerThousandSqFt, productName = '') {
  // Validate inputs
  if (!areaSqFt || areaSqFt <= 0) {
    return {
      error: 'Enter a valid area in square feet.',
      valid: false
    };
  }

  if (!ratePerThousandSqFt || ratePerThousandSqFt <= 0 || isNaN(ratePerThousandSqFt)) {
    return {
      error: 'No stored application rate for the selected product. Please refer to the product label.',
      valid: false
    };
  }

  // Calculate amounts
  const areaThousands = areaSqFt / 1000;
  const totalLbs = areaThousands * ratePerThousandSqFt;

  return {
    valid: true,
    productName,
    areaSqFt,
    areaThousands,
    ratePerThousandSqFt,
    totalLbs
  };
}

/**
 * Extract granular rate from a chemical object
 * @param {Object} chemical - Chemical object with potential rate information
 * @returns {number|null} Rate per thousand square feet, or null if not found
 */
function extractGranularRate(chemical) {
  if (!chemical) return null;

  // Use stored default granular rate if available
  if (chemical.defaultGranularRatePerThousandSqFt) {
    return chemical.defaultGranularRatePerThousandSqFt;
  }

  // Attempt to extract from mixRate string as fallback
  if (chemical.mixRate) {
    const match = chemical.mixRate.match(/([0-9]+\.?[0-9]*)/);
    if (match) {
      const rate = parseFloat(match[1]);
      if (!isNaN(rate)) {
        return rate;
      }
    }
  }

  return null;
}

// Export functions for use in the main app
if (typeof window !== 'undefined') {
  window.CalculatorUtils = {
    calculateMixAmounts,
    calculateGranularAmount,
    extractGranularRate
  };
}

// Also support module exports for potential Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateMixAmounts,
    calculateGranularAmount,
    extractGranularRate
  };
}
