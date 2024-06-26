using FluentAssertions;
using PredictorLibrary;

namespace Tests;

public class FixedGrowthAndFixedMinimalRiskReturnTests
{
    private ModelParameters _modelParameters;

    public FixedGrowthAndFixedMinimalRiskReturnTests()
    {
        _modelParameters = new ModelParameters
        {
            StartYear = 2024,
            AgeAtStart = 50,
            EndYear = 2044,
            AmountAtStart = 0,
            //AnnualContribution = 1000,
            GrowthReturnMean = 0.05,
            GrowthAllocation = 0.5,
            MinimalRiskReturnMean = 0
        };
    }
    
    [Fact]
    public void CanSetupFirstYear()
    {
       // act
        var model = new PensionModel(_modelParameters);
        model.Calculate();

        var firstYear = model.GetYear(0);
        
        // assert
        firstYear.Index.Should().Be(0);
        firstYear.Year.Should().Be(_modelParameters.StartYear);
        firstYear.Age.Should().Be(_modelParameters.AgeAtStart);
    //    firstYear.AmountAtStartOfYear.Should().Be(_modelParameters.AmountAtStart + _modelParameters.AnnualContribution);
    }

    [Theory]
    [InlineData(0, 1025)]
    [InlineData(1, 2075.625 )]
    [InlineData(5, 6547.43)]
    [InlineData(20, 27862.856 )]
    public void CanCalculateTotalForYear(int yearIndex, double expectedTotal)
    {
        // act
        var model = new PensionModel(_modelParameters);

        model.Calculate();
        
        // assert
        var yearFigures = model.GetYear(yearIndex);

        yearFigures.AmountAtEndOfYear.Should().BeApproximately(expectedTotal, 0.01);
    }
}