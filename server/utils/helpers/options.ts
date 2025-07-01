import { QueryProp } from "../../types/query";

export const getOpenAIOptions = (
  query: QueryProp,
  env: NodeJS.ProcessEnv
) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.OPENAI_APP_MODEL,
      messages: [
        {
          role: "user",
          content: `${env.OPENAI_APP_CONTENT} ${typeof query === 'string' ? query : JSON.stringify(query)}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  };
};

export const getFSOptions = (method: string, auth: string): RequestInit => {
  return {
    method,
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  };
};
