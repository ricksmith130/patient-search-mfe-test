export const buildQueryResults = (data: any) => ({
  results: data?.results ?? [],
  resultsCount: data?.resultsCount ?? 0,
  options: data?.options ?? {},
})

export const buildQueryArguments = (args: any, requestId: string) => ({
  ...args,
  searchUuid: requestId,
})

export const buildPostcodeSearchArguments = (args: any, requestId: string) => ({
  ...args,
  searchUuid: requestId,
})
