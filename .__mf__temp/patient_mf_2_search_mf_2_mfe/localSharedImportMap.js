
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    import {loadShare} from "@module-federation/runtime";
    const importMap = {
      
        "nhsuk-react-components": async () => {
          let pkg = await import("__mf__virtual/patient_mf_2_search_mf_2_mfe__prebuild__nhsuk_mf_2_react_mf_2_components__prebuild__.js");
            return pkg;
        }
      ,
        "nhsuk-react-components-extensions": async () => {
          let pkg = await import("__mf__virtual/patient_mf_2_search_mf_2_mfe__prebuild__nhsuk_mf_2_react_mf_2_components_mf_2_extensions__prebuild__.js");
            return pkg;
        }
      ,
        "react": async () => {
          let pkg = await import("__mf__virtual/patient_mf_2_search_mf_2_mfe__prebuild__react__prebuild__.js");
            return pkg;
        }
      ,
        "react-dom": async () => {
          let pkg = await import("__mf__virtual/patient_mf_2_search_mf_2_mfe__prebuild__react_mf_2_dom__prebuild__.js");
            return pkg;
        }
      ,
        "react-redux": async () => {
          let pkg = await import("__mf__virtual/patient_mf_2_search_mf_2_mfe__prebuild__react_mf_2_redux__prebuild__.js");
            return pkg;
        }
      ,
        "react-router-dom": async () => {
          let pkg = await import("__mf__virtual/patient_mf_2_search_mf_2_mfe__prebuild__react_mf_2_router_mf_2_dom__prebuild__.js");
            return pkg;
        }
      ,
        "redux": async () => {
          let pkg = await import("__mf__virtual/patient_mf_2_search_mf_2_mfe__prebuild__redux__prebuild__.js");
            return pkg;
        }
      
    }
      const usedShared = {
      
          "nhsuk-react-components": {
            name: "nhsuk-react-components",
            version: "6.0.0-beta.4",
            scope: ["default"],
            loaded: false,
            from: "patient-search-mfe",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"nhsuk-react-components"}' must be provided by host`);
              }
              usedShared["nhsuk-react-components"].loaded = true
              const {"nhsuk-react-components": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "6.0.0-beta.4",
              
            }
          }
        ,
          "nhsuk-react-components-extensions": {
            name: "nhsuk-react-components-extensions",
            version: "2.3.5-beta",
            scope: ["default"],
            loaded: false,
            from: "patient-search-mfe",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"nhsuk-react-components-extensions"}' must be provided by host`);
              }
              usedShared["nhsuk-react-components-extensions"].loaded = true
              const {"nhsuk-react-components-extensions": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^2.3.5-beta",
              
            }
          }
        ,
          "react": {
            name: "react",
            version: "19.1.1",
            scope: ["default"],
            loaded: false,
            from: "patient-search-mfe",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react"}' must be provided by host`);
              }
              usedShared["react"].loaded = true
              const {"react": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^19.1.1",
              
            }
          }
        ,
          "react-dom": {
            name: "react-dom",
            version: "19.1.1",
            scope: ["default"],
            loaded: false,
            from: "patient-search-mfe",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react-dom"}' must be provided by host`);
              }
              usedShared["react-dom"].loaded = true
              const {"react-dom": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^19.1.1",
              
            }
          }
        ,
          "react-redux": {
            name: "react-redux",
            version: "9.2.0",
            scope: ["default"],
            loaded: false,
            from: "patient-search-mfe",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react-redux"}' must be provided by host`);
              }
              usedShared["react-redux"].loaded = true
              const {"react-redux": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^9.2.0",
              
            }
          }
        ,
          "react-router-dom": {
            name: "react-router-dom",
            version: "7.9.6",
            scope: ["default"],
            loaded: false,
            from: "patient-search-mfe",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react-router-dom"}' must be provided by host`);
              }
              usedShared["react-router-dom"].loaded = true
              const {"react-router-dom": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^7.13.0",
              
            }
          }
        ,
          "redux": {
            name: "redux",
            version: "5.0.1",
            scope: ["default"],
            loaded: false,
            from: "patient-search-mfe",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"redux"}' must be provided by host`);
              }
              usedShared["redux"].loaded = true
              const {"redux": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^5.0.1",
              
            }
          }
        
    }
      const usedRemotes = [
                {
                  entryGlobalName: "ncrs_host",
                  name: "ncrs-host",
                  type: "module",
                  entry: "http://localhost:5173/remoteEntry.js",
                  shareScope: "default",
                }
          
      ]
      export {
        usedShared,
        usedRemotes
      }
      