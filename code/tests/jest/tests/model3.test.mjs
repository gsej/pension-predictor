"use strict";

const fetchModel3Data = async (requestBody) => {
    const response = await fetch('http://localhost:5200/api/model3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    const body = await response.json();
    return {
        response,
        body
    }
  };

describe('Model3', () => {

    describe('when called with a valid request', () => {
        const requestBody = {
            startYear: 2020,
            ageAtStart: 30,
            endYear: 2022,
            amountAtStart: 1000,
            annualContribution: 1000,
            allocations: [
                {
                    name: "Equities",
                    proportion: 1,
                    meanAnnualReturn: 0,
                    standardDeviation: 0
                }
            ],
            targetAge: 60
        };

        let response, body;        

        beforeAll(async () => {
            ({ response, body } = await fetchModel3Data(requestBody));
        });


        it('should return 200', () => {
            expect(response.status).toBe(200);
        });

        it('should return a correct set of years', () => {
            const years = body.years;

            expect(years.length).toBe(3);

            expect(years[0].calendarYear).toBe(2020);
            expect(years[0].yearIndex).toBe(0);
            expect(years[0].age).toBe(30);

            expect(years[1].calendarYear).toBe(2021);
            expect(years[1].yearIndex).toBe(1);
            expect(years[1].age).toBe(31);

            expect(years[2].calendarYear).toBe(2022);
            expect(years[2].yearIndex).toBe(2);
            expect(years[2].age).toBe(32);
        });
    });

    describe('when called with zero mean annual return', () => {

        const requestBody = {
            startYear: 2020,
            ageAtStart: 30,
            endYear: 2022,
            amountAtStart: 1000,
            annualContribution: 1000,
            allocations: [
                {
                    name: "Equities",
                    proportion: 1,
                    meanAnnualReturn: 0,
                    standardDeviation: 0
                }
            ],
            targetAge: 60
        };

        let response, body;

        beforeAll(async () => {
            ({ response, body } = await fetchModel3Data(requestBody));
        });

        it('should return 200', () => {
            expect(response.status).toBe(200);
        });

        it('should have zero investment return', () => {
            const years = body.years;

            years.forEach(year => {
                expect(year.investmentReturn).toBe(0);
              });
            
        });

        it('should have correct start of year values', () => {
            const years = body.years;

            expect(years[0].priorYear).toBe(1000);
            expect(years[0].amountAtStart).toBe(2000);

            expect(years[1].priorYear).toBe(2000);
            expect(years[1].amountAtStart).toBe(3000);

            expect(years[2].priorYear).toBe(3000);
            expect(years[2].amountAtStart).toBe(4000);
        });

        it('should have correct end of year values', () => {
            const years = body.years;
            expect(years[0].amountAtEnd).toBe(2000);
            expect(years[1].amountAtEnd).toBe(3000);
            expect(years[2].amountAtEnd).toBe(4000);
        });
    });


    describe('when called with one allocation with a non-zero mean annual return', () => {

        const requestBody = {
            startYear: 2020,
            ageAtStart: 30,
            endYear: 2022,
            amountAtStart: 1000,
            annualContribution: 1000,
            allocations: [
                {
                    name: "Equities",
                    proportion: 1,
                    meanAnnualReturn: 0.05,
                    standardDeviation: 0
                }
            ],
            targetAge: 60
        };

        let response, body;

        beforeAll(async () => {
            ({ response, body } = await fetchModel3Data(requestBody));
        });

        it('should return 200', () => {
            expect(response.status).toBe(200);
        });

        it('should have correct investment return', () => {
            const years = body.years;

            expect(years[0].investmentReturn).toBe(100);
            expect(years[1].investmentReturn).toBe(155);
            expect(years[2].investmentReturn).toBe(212.75);
        });

        it('should have correct end of year values', () => {
            const years = body.years;
            expect(years[0].amountAtEnd).toBe(2100);
            expect(years[1].amountAtEnd).toBe(3255);
            expect(years[2].amountAtEnd).toBe(4467.75);
        });
    });

    describe('when called with two allocations with non-zero mean annual returns', () => {

        const requestBody = {
            startYear: 2020,
            ageAtStart: 30,
            endYear: 2022,
            amountAtStart: 1000,
            annualContribution: 1000,
            allocations: [
                {
                    name: "Equities",
                    proportion: 0.8,
                    meanAnnualReturn: 0.05,
                    standardDeviation: 0
                },
                {
                    name: "Minimal Risk",
                    proportion: 0.2,
                    meanAnnualReturn: 0.01,
                    standardDeviation: 0
                },
                
            ],
            targetAge: 60
        };

        let response, body;

        beforeAll(async () => {
            ({ response, body } = await fetchModel3Data(requestBody));
        });

        it('should return 200', () => {
            expect(response.status).toBe(200);
        });

        it('should have correct investment return', () => {
            const years = body.years;

            expect(years[0].investmentReturn).toBe(84);
            expect(years[1].investmentReturn).toBeCloseTo(129.528, 3);
            expect(years[2].investmentReturn).toBeCloseTo(176.968, 3);
        });

        it('should have correct end of year values', () => {
            const years = body.years;
            expect(years[0].amountAtEnd).toBe(2084);
            expect(years[1].amountAtEnd).toBeCloseTo(3213.528, 3);
            expect(years[2].amountAtEnd).toBeCloseTo(4390.496, 3);
        });
    });

    describe('when called with non-zero mean annual return and non-zero standard deviation', () => {

        const requestBody = {
            startYear: 2020,
            ageAtStart: 30,
            endYear: 2022,
            amountAtStart: 1000,
            annualContribution: 1000,
            allocations: [
                {
                    name: "Equities",
                    proportion: 0.8,
                    meanAnnualReturn: 0.05,
                    standardDeviation: 0.25
                }
            ],
            targetAge: 60
        };

        let response1, body1, response2, body2;

        beforeAll(async () => {
            ({ response: response1, body: body1 } = await fetchModel3Data(requestBody));
            ({ response: response2, body: body2 } = await fetchModel3Data(requestBody));
        });

        it('should return 200', () => {
            expect(response1.status).toBe(200);
            expect(response2.status).toBe(200);
        });

        it('should have variable investment return', () => {
            // Because of the standard deviation, the returns should differ
            const years1 = body1.years;
            const years2 = body2.years;
            expect(years1[0].investmentReturn).not.toBe(years2[0].investmentReturn);
            expect(years1[1].investmentReturn).not.toBe(years2[1].investmentReturn);
            expect(years1[2].investmentReturn).not.toBe(years2[2].investmentReturn);
        });

        it('should have variable end of year values', () => {
            // Because of the standard deviation, the end of year values should differ
            const years1 = body1.years;
            const years2 = body2.years;
            expect(years1[0].amountAtEnd).not.toBe(years2[0].amountAtEnd);
            expect(years1[1].amountAtEnd).not.toBe(years2[1].amountAtEnd);
            expect(years1[2].amountAtEnd).not.toBe(years2[2].amountAtEnd);
        });
    });

})
