"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  run,
  reset,
  hide,
  acceptCategory,
  showPreferences,
} from "vanilla-cookieconsent";
import pluginConfig from "./CookieConsentConfig";

const acceptAndHide = (acceptType: string | string[]) => {
  acceptCategory(acceptType);
  hide();
};

const resetPlugin = () => {
  reset(true);
  run(pluginConfig);
};

const toggleDarkMode = () => {
  document.documentElement.classList.toggle("cc--darkmode");
};

const CookieConsentApiBtns = () => {
  return (
    <Card className="max-w-md mx-auto mt-6 p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <h2 className="text-lg font-semibold">Cookie Preferences</h2>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={showPreferences} variant="outline">
          Show Preferences
        </Button>
        <Button onClick={() => acceptAndHide("all")} variant="default">
          Accept All
        </Button>
        <Button onClick={() => acceptAndHide([])} variant="secondary">
          Accept Necessary
        </Button>
        <Button onClick={resetPlugin} variant="destructive">
          Reset Plugin
        </Button>
        <Button onClick={toggleDarkMode} variant="ghost">
          Toggle Dark Mode
        </Button>
      </CardContent>
    </Card>
  );
};

export default CookieConsentApiBtns;
