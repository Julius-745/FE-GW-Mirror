import React, { useCallback, useEffect } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { PUBLIC_ROUTES } from "@constant";

import theme from "@styles/theme";
import { httpClient } from "@queries/httpClient";

const queryClient = new QueryClient();

const Root: React.FC = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);

  const checkAuth = useCallback(async (pathName: string) => {
    if (pathName === "/" || !PUBLIC_ROUTES.some((n) => pathName.includes(n))) {
      setIsLoading(true);
      try {
        await httpClient.get("/user/me");
      } catch (error) {
        router.replace(`/login?redirectTo=${pathName}`);
      } finally {
        setIsLoading(false);
      }
    }

    // prevent visiting login page if already logged in
    if (pathName === "/login") {
      setIsLoading(true);
      try {
        await httpClient.get("/user/me");
        router.replace("/");
      } catch (error) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    checkAuth(router.pathname);
  }, [router.pathname]);

  return <>{children}</>;
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Root>
          <Component {...pageProps} />
        </Root>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
export default MyApp;
