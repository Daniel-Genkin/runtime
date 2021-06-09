// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

// This file defines various types related with the interaction with Dotnet interop

// TODO find better types than the anys, however it will do for now

export interface BINDING { // Should BINDING be renamed?
    call_static_method: (method: string, params: any[]) => void,
    mono_bindings_init: (binding: string) => void,
	mono_bind_method: (method: string, this_arg: number, args_marshal: string?, friendly_name: string) => any,
	mono_method_invoke: (method: number, this_arg: number, args_marshal: string, args: any) => any,
	mono_method_get_call_signature:  (method: string, mono_obj: any[]) => any,
	mono_method_resolve: (fqn: string) => any,
	mono_bind_static_method: (fqn: string, signature: string?) => any,
	mono_call_static_method: (fqn: string, args: any, signature: string) => any,
	mono_bind_assembly_entry_point: (assembly: any, signature: string?) => any,
	mono_call_assembly_entry_point: (assembly: any, args: any, signature: string?) => any,
	mono_intern_string: (string: string) => any,
}

export interface MONO { //should MONO be renamed?
	pump_message: () => void,
	mono_load_runtime_and_bcl: (unused_vfs_prefix /* unused - can it be removed? */ : any, deploy_prefix: String, debug_level: number, file_list, loaded_cb: () => void, fetch_file_cb: (asset: string) => void) => any,
	mono_load_runtime_and_bcl_args: (args: MonoRuntimeArgs) => any,
	mono_wasm_load_bytes_into_heap: (bytes: Uint8Array) => number,
	mono_wasm_load_icu_data: (offset: number) => boolean,
	mono_wasm_get_icudt_name: (culture: string) => any, // todo technically we can define culture as a set of valid cultures instead of just string
	mono_wasm_globalization_init: (globalization_mode: GlobalizationMode) => void,
	mono_wasm_get_loaded_files: () => LoadedFiles[],
	mono_wasm_new_root_buffer: (capacity: number, msg: string) => WasmRootBuffer,
	mono_wasm_new_root_buffer_from_pointer: (offset: number, capacity: number, msg: string)  => WasmRootBuffer,
	mono_wasm_new_root: (value: number) => WasmRoot,
	mono_wasm_new_roots: (count_or_values: number[] | number) => number[],
	mono_wasm_release_roots: () => void,
}

type MonoRuntimeArgs = {
	fetch_file_cb: (asset: string) => void,
	loaded_cb: () => void,
	debug_level: number,
	assembly_root: string,
	assets: {
		name: string,
		behavior: string
	}[]
}

type LoadedFiles = { 
	url: string,
	file: string
}[]

type GlobalizationMode = "icu" | "invarient" | "auto";

type WasmRootBuffer = {
	__offset: number,
	__offset32: number,
	__count: number,
	length: number,
	__handle: any,
	__ownsAllocation: boolean
	// TODO add the functions and change from a type to a class (?)
}

type WasmRoot = {
	get_address: () => number,
	get_address_32: () => number,
	get: () => number,
	set: (value: any) => any,
	valueOf: () => number,
	clear: () => void,
	toString: () => string,
	release: any,
	__buffer: any;
	__index: number;
}