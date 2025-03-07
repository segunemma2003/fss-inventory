import { User } from "@/types";
import { faker } from "@faker-js/faker";

export const makeArrayData = <T = unknown>(func: () => T) =>
  faker.helpers.multiple(func, { count: 10 });

export const makeArrayDataWithLength = <T = unknown>(
  func: () => T,
  length: number
) => faker.helpers.multiple(func, { count: length });

export const getLoginInfo = () => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};

export const getLoginToken = () => {
  return {
    token: faker.string.uuid(),
  };
};

enum BusinessType {
  Wholesale = "Wholesale",
  Retail = "Retail",
}

export const getLoginUser = (): User => {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    businessAddress: faker.location.streetAddress(),
    businessCAC: faker.finance.iban(),
    businessEmail: faker.internet.email(),
    businessName: faker.company.name(),
    businessType: faker.helpers.enumValue(BusinessType),
    country: faker.location.country(),
    dateOfBirth: faker.date.birthdate().toISOString(),
    email: faker.internet.email(),
    gender: faker.person.sex(),
    id: faker.string.uuid(),
    industry: faker.commerce.department(),
    jobTitle: faker.person.jobTitle(),
    numberOfEmployees: faker.number.int({ min: 1, max: 100 }).toString(),
    phoneNumber: faker.phone.number(),
    role: "admin",
    zipCode: faker.location.zipCode(),
  };
};