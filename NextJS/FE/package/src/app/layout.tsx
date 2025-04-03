"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { DashboardContextProvider } from './context/DashboardContext';
import { AuthContextProvider } from './context/AuthContext';
import "@/app/global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={baselightTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <AuthContextProvider>
            <DashboardContextProvider>
              <CssBaseline />
              {children}
            </DashboardContextProvider>
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
