// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

// This file defines various types related with the WASM API

export namespace DotNet {
    type onConfigLoaded = (config: MonoConfig) => MonoConfig;
    type onRuntimeInitialized = () => void;
    type onMonoRuntimeInitialized = (error: Error) => void;
}

export type MonoConfig = {
    assembly_root: string,
    debug_level: number,
    assets: (AssetEntry | AssetEntry | SatelliteAssemblyEntry | VfsEntry | IcuData)[],
    remote_sources: string[],
    [index: string]: any, // overflow for the "Extra" sections
}

// Types of assets that can be in the mono-config.js/mono-config.json file (taken from /src/tasks/WasmAppBuilder/WasmAppBuilder.cs)
type AssetEntry = {
    behavior: string,
    name: string
}

interface AssemblyEntry extends AssetEntry {
    name: "assembly"
}

interface SatelliteAssemblyEntry extends AssetEntry {
    name: "resource",
    culture: string
}

interface VfsEntry extends AssetEntry {
    name: "vfs",
    virtual_path: string
}

interface IcuData extends AssetEntry {
    name: "icu",
    load_remote: boolean
}