import { generateBookingDateTime } from "./bookings";

it("returns correct date", () => {
  const daysFromNow = 1;
  const hours = 10;
  const result = generateBookingDateTime({ daysFromNow, hours });
  expect(result.getDate()).toBe(new Date().getDate() + daysFromNow);
  expect(result.getHours()).toBe(hours);
});
