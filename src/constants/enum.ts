export enum BundleStatusEnum {
  New = 1,
  Draft = 2,
  Unpublished = 3,
  Published = 4,
}

export enum OrderStatusEnum {
  Inprocess = 1,
  Completed = 2,
  Cancelled = 3,
  Failed = 4,
}

export const ConnectionTypeOptions = [
  { value: "1", label: "SQL Server" },
  { value: "2", label: "Postgre Sql" }
];

