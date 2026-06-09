export interface ApiResponse<T> {
  data: T[];
  metadata: {
    totalCount: number;
    currentOffset: number;
  };
}
