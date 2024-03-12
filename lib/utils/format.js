export function formatToDecimal(inputNumber) {
  // Convert number to string
  var formattedString = inputNumber.toString()

  // Check if the string contains a period
  if (formattedString.indexOf('.') !== -1) {
    // Split the string into whole and fractional parts
    var parts = formattedString.split('.')
    var wholePart = parts[0]
    var fractionalPart = parts[1]

    // If fractional part length is 0, add two zeros
    if (!fractionalPart) {
      fractionalPart = '00'
    }
    // If fractional part length is 1, add one zero
    else if (fractionalPart.length === 1) {
      fractionalPart += '0'
    }

    // Concatenate whole and fractional parts with a comma
    formattedString = wholePart + ',' + fractionalPart
  } else {
    // No fractional part, add ',00'
    formattedString += ',00'
  }

  return formattedString
}
