using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using PredictorLibrary.Model1;
using PredictorLibrary.Model1.Inputs;
using PredictorLibrary.Model1.Outputs;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class Model1Controller : ControllerBase
{
    private readonly Model1Predictor _model1Predictor;

    public Model1Controller(Model1Predictor model1Predictor)
    {
        _model1Predictor = model1Predictor;
    }

    [HttpPost]
    public Model1Prediction GetPrediction([FromBody] Model1Inputs inputs)
    {
        var prediction = _model1Predictor.Generate(inputs);
        return prediction;
    }
    
    public class Model1Example : ISchemaFilter
    {
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            if (context.Type == typeof(Model1Inputs))
            {
                schema.Example = new OpenApiObject()
                {
                    ["startYear"] = new OpenApiInteger(2025),
                    ["ageAtStart"] = new OpenApiInteger(30),
                    ["endYear"] = new OpenApiInteger(2065),
                    ["amountAtStart"] = new OpenApiInteger(100000),
                    ["annualContribution"] = new OpenApiInteger(12000),
                    ["meanAnnualReturn"] = new OpenApiDouble(0.05),
                    ["targetAge"] = new OpenApiInteger(67),
                };
            }
        }
    }
}