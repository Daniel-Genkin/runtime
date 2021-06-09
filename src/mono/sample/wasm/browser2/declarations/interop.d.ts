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
