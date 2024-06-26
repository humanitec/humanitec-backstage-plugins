import fetch from "cross-fetch";
import { apiConfig, Configuration, PublicApi, ResponseError } from "@humanitec/autogen";

export type HumanitecClient = ReturnType<typeof createHumanitecClient>
export const HumanitecResponseError = ResponseError;

export function createHumanitecClient({ token }: { token: string; }) {
  const aConfig = apiConfig({
    token,
    internalApp: 'humanitec-backstage/latest',
  });
  const config = new Configuration({
    basePath: aConfig.basePath,
    headers: aConfig.headers,
    fetchApi: fetch,
  });

  return new PublicApi(config);
}
