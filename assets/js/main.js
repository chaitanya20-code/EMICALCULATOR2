$(document).ready(function () {

    // Format the input field with Euro currency style (comma separated and decimal)
    $('#amount').on('input', function () {
        let value = $(this).val();
        
        // Remove any non-numeric characters except for decimal
        value = value.replace(/[^0-9.]/g, '');

        // Split the integer and decimal parts
        let parts = value.split('.');

        // Format the integer part with commas
        if (parts[0]) {
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");  // Change regex to ensure the correct formatting
        }

        // Join integer and decimal parts
        if (parts[1]) {
            parts[1] = parts[1].substring(0, 2); // Limit decimal to 2 digits
        }

        // Rebuild the value and set it in the input field
        let formattedValue = parts.join('.');

        // Set the formatted value back to the input
        $(this).val(formattedValue);
    });

    // When the calculate button is clicked
    $('#calculateBtn').click(function () {
        var principal = parseFloat($('#amount').val().replace(/,/g, '').replace('€', '').trim());
        var interestRate = parseFloat($('#interest').val());
        var tenure = parseInt($('#tenure').val());
        var frequency = $('#frequency').val();
        var startDate = $('#startDate').val();

        // Validate input values
        if (isNaN(principal) || isNaN(interestRate) || isNaN(tenure) || principal <= 0 || interestRate <= 0 || tenure <= 0 || !startDate) {
            alert("Please enter valid values.");
            return;
        }

        // Calculate the number of payments (in months, quarters, semi-annual, or annual)
        var months = tenure * 12;

        // Adjust for different payment frequencies
        if (frequency === "quarterly") {
            months = tenure * 4;  // 4 payments per year
        } else if (frequency === "semiannually") {
            months = tenure * 2;  // 2 payments per year
        } else if (frequency === "annually") {
            months = tenure;  // 1 payment per year
        }

        // Monthly interest rate
        var monthlyInterestRate = (interestRate / 100) / 12;

        // EMI calculation formula (standard EMI formula)
        var emi = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) / (Math.pow(1 + monthlyInterestRate, months) - 1);

        // If the frequency is not monthly, adjust the EMI calculation
        if (frequency === "quarterly") {
            emi *= 3;  // Multiply by 3 for quarterly
        } else if (frequency === "semiannually") {
            emi *= 6;  // Multiply by 6 for semi-annually
        } else if (frequency === "annually") {
            emi *= 12;  // Multiply by 12 for annually
        }

        // Calculate total payable amount
        var totalPayable = emi * months;

        // Format result in Euro currency
        function formatCurrency(amount) {
            return '€ ' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // Display the EMI frequency in human-readable format
        var frequencyText = '';
        if (frequency === 'monthly') {
            frequencyText = 'Monthly';
        } else if (frequency === 'quarterly') {
            frequencyText = 'Quarterly (Every 3 months)';
        } else if (frequency === 'semiannually') {
            frequencyText = 'Semi-Annually (Every 6 months)';
        } else if (frequency === 'annually') {
            frequencyText = 'Annually (Every 12 months)';
        }

        // Show results
        $('#emiAmount').text(formatCurrency(emi.toFixed(2)));
        $('#emiFrequency').text(frequencyText); // Show the selected EMI frequency
        $('#totalPayable').text(formatCurrency(totalPayable.toFixed(2)));

        // Calculate and show end date based on tenure and start date
        var start = new Date(startDate);
        var end = new Date(start);
        end.setFullYear(start.getFullYear() + tenure);  // Add tenure years to start date

        var endDate = end.toISOString().split('T')[0]; // Format date as yyyy-mm-dd
        $('#endDate').text(endDate);

        // Calculate and show payment dates
        var paymentDates = [];
        var currentDate = new Date(startDate);
        for (var i = 0; i < months; i++) {
            if (frequency === 'monthly') {
                currentDate.setMonth(currentDate.getMonth() + 1);
            } else if (frequency === 'quarterly') {
                currentDate.setMonth(currentDate.getMonth() + 3);
            } else if (frequency === 'semiannually') {
                currentDate.setMonth(currentDate.getMonth() + 6);
            } else if (frequency === 'annually') {
                currentDate.setFullYear(currentDate.getFullYear() + 1);
            }
            paymentDates.push(new Date(currentDate));  // Add the payment date
        }

        // Show the list of payment dates
        $('#paymentDates').empty();
        paymentDates.forEach(function (date) {
            $('#paymentDates').append('<li>' + date.toISOString().split('T')[0] + '</li>');
        });

        // Show the result section
        $('#result').show();
    });
});
