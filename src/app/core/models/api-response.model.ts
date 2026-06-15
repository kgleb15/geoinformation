export interface ApiResponseModel<T> {
  data: T[];
  metadata: {
    totalCount: number;
    currentOffset: number;
  };
}
