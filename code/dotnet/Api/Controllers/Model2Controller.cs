using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using PredictorLibrary.Model2;
using PredictorLibrary.Model2.Inputs;
using PredictorLibrary.Model2.Outputs;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class Model2Controller : ControllerBase
{
    [HttpPost]
    public Model2Prediction GetPrediction([FromBody] Model2Inputs inputs)
    {
        var predictor = new Model2Predictor();
        var prediction = predictor.Generate(inputs);
        return prediction;
    }

    public class Model2Example : ISchemaFilter
    {
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            if (context.Type == typeof(Model2Inputs))
            {
                schema.Example = new OpenApiObject()
                {
                    ["startYear"] = new OpenApiInteger(2025),
                    ["ageAtStart"] = new OpenApiInteger(30),
                    ["endYear"] = new OpenApiInteger(2065),
                    ["amountAtStart"] = new OpenApiInteger(100000),
                    ["annualContribution"] = new OpenApiInteger(12000),
                    ["allocations"] = new OpenApiArray()
                    {
                        new OpenApiObject()
                        {
                            ["name"] = new OpenApiString("Growth"),
                            ["proportion"] = new OpenApiDouble(0.8),
                            ["meanAnnualReturn"] = new OpenApiDouble(0.05),
                        },
                        new OpenApiObject()
                        {
                            ["name"] = new OpenApiString("Minimal Risk"),
                            ["proportion"] = new OpenApiDouble(0.2),
                            ["meanAnnualReturn"] = new OpenApiDouble(0.01),
                        },
                    },
                    ["targetAge"] = new OpenApiInteger(67),
                };
            }
        }
    }
}