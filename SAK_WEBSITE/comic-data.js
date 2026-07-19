(() => {
  const apiUrl = new URL("/api/flames-of-war", window.location.origin);
  const staticUrl = new URL("flames-data.json", document.baseURI);
  const dataSources = window.location.pathname.includes("/SAK_WEBSITE/")
    ? [staticUrl, apiUrl]
    : [apiUrl, staticUrl];

  function validateComicData(payload) {
    if (!payload || payload.ok !== true || !Array.isArray(payload.folders) || !payload.folders.length) {
      throw new Error("Comic data has an invalid folder structure.");
    }
    payload.folders.forEach((folder) => {
      if (!folder || typeof folder.name !== "string" || !Array.isArray(folder.pages) || folder.pages.some((page) => typeof page !== "string")) {
        throw new Error("Comic data has an invalid page structure.");
      }
    });
    return payload;
  }

  function normalizeComicData(payload) {
    const staticSitePrefix = window.location.pathname.includes("/SAK_WEBSITE/") ? "../" : "";
    return {
      ...payload,
      folders: payload.folders.map((folder) => {
        const sourcePath = String(folder.basePath || "").replace(/^(\.\.\/)+/, "");
        return { ...folder, basePath: sourcePath ? `${staticSitePrefix}${sourcePath}` : "" };
      }),
    };
  }

  async function fetchJson(url) {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    const contentType = response.headers.get("content-type") || "";
    const body = await response.text();
    if (!response.ok) throw new Error(`Comic data request failed with status ${response.status}.`);
    if (!contentType.toLowerCase().includes("application/json")) {
      throw new Error(`Comic data request returned ${contentType || "an unknown content type"}.`);
    }
    try {
      return normalizeComicData(validateComicData(JSON.parse(body)));
    } catch (error) {
      if (error instanceof SyntaxError) throw new Error("Comic data response was not valid JSON.");
      throw error;
    }
  }

  async function load() {
    let lastError;
    for (const url of dataSources) {
      try {
        return await fetchJson(url);
      } catch (error) {
        lastError = error;
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
          console.debug("[SAK] Comic data source unavailable:", url.href, error.message);
        }
      }
    }
    throw lastError || new Error("Comic data could not be loaded.");
  }

  window.SAKComicData = { load };
})();
