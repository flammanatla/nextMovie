import { describe } from "node:test";
import {
  calculatePlannedCollectionDate,
  calculateCollectionSchedule,
  calculateAdjustedCollectionDate,
} from "../utils/helpers.js";
import { loadBankHolidays } from "../utils/loadBankHolidays.js";

// Mock the external function
jest.mock("../utils/loadBankHolidays.js");

describe("helpers.js", () => {
  describe("calculatePlannedCollectionDate", () => {
    test.each`
      todayDate                          | expected
      ${new Date("2024-01-01T00:00:01")} | ${"Wed Jan 03 2024"}
      ${new Date("2024-01-02T00:00:01")} | ${"Wed Jan 03 2024"}
      ${new Date("2024-01-03T00:00:01")} | ${"Wed Jan 03 2024"}
      ${new Date("2024-01-04T00:00:01")} | ${"Wed Jan 10 2024"}
      ${new Date("2024-01-05T00:00:01")} | ${"Wed Jan 10 2024"}
      ${new Date("2024-01-06T00:00:01")} | ${"Wed Jan 10 2024"}
      ${new Date("2024-01-07T00:00:01")} | ${"Wed Jan 10 2024"}
    `("should return the date of next Wednesday", ({ todayDate, expected }) => {
      const result = calculatePlannedCollectionDate(todayDate);
      console.log(result);
      expect(result.toDateString()).toEqual(expected);
    });
  });

  describe("calculateCollectionSchedule", () => {
    test.each`
      plannedCollectionDate | expected
      ${"2023-12-27"}       | ${["Non-recyclable", "Paper and cardboard", "Food waste"]}
      ${"2023-12-20"}       | ${["Garden waste", "Plastic, cans and glass", "Food waste"]}
      ${"2024-01-03"}       | ${["Garden waste", "Plastic, cans and glass", "Food waste"]}
    `(
      "should return correct list of bins for the planned collection date",
      ({ plannedCollectionDate, expected }) => {
        expect(calculateCollectionSchedule(plannedCollectionDate)).toEqual(
          expected
        );
      }
    );
  });

  describe("calculateAdjustedCollectionDate", () => {
    test.each`
      todayDate                          | plannedCollectionDate              | expectedAdjustedCollectionDate
      ${new Date("2024-01-01T00:00:01")} | ${new Date("2024-01-03T00:00:01")} | ${"Thu Jan 04 2024"}
      ${new Date("2024-01-09T00:00:01")} | ${new Date("2024-01-10T00:00:01")} | ${"Thu Jan 11 2024"}
      ${new Date("2024-01-17T00:00:01")} | ${new Date("2024-01-17T00:00:01")} | ${"Thu Jan 18 2024"}
      ${new Date("2024-01-25T00:00:01")} | ${new Date("2024-01-31T00:00:01")} | ${"Wed Jan 31 2024"}
      ${new Date("2024-02-02T00:00:01")} | ${new Date("2024-02-07T00:00:01")} | ${"Wed Feb 07 2024"}
      ${new Date("2024-02-10T00:00:01")} | ${new Date("2024-02-14T00:00:01")} | ${"Wed Feb 14 2024"}
      ${new Date("2024-02-18T00:00:01")} | ${new Date("2024-02-21T00:00:01")} | ${"Wed Feb 21 2024"}
    `(
      "should return adjusted collection date",
      async ({
        todayDate,
        plannedCollectionDate,
        expectedAdjustedCollectionDate,
      }) => {
        const bankHolidays = {
          year: 2024,
          days: [
            "2024-01-01",
            "2024-01-09",
            "2024-01-17",
            "2024-01-25",
            "2024-02-02",
            "2024-02-10",
            "2024-02-18",
          ],
        };

        loadBankHolidays.mockResolvedValueOnce(bankHolidays);

        console.log(plannedCollectionDate);

        const result = await calculateAdjustedCollectionDate(
          todayDate,
          plannedCollectionDate
        );
        expect(result.toDateString()).toEqual(expectedAdjustedCollectionDate);
      }
    );
  });
});
