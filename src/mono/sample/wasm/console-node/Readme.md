# Sample Overview

This samples showcases how we can run C# + 3rd party nuget packages alongside NodeJS NPM packages in a single project via WASM!!

## Dependencies setup

**NuGet**

*Wasm.Console.NodeSample.csproj*
```
<ItemGroup>
    <PackageReference Include="NodaTime" Version="3.0.5"/>
</ItemGroup>
```
Then they are imported as normal in C# via `using [PACKAGE NAME];`.


**NPM**

*package.json*
```
"dependencies": {
    "lodash": "^4.17.5"
}
```
Then they are imported via `require(PACKAGE NAME);`.

## Running the sample
1. `./build.cmd mono+libs -os Browser -c Debug /p:ForNode=true`
2. `./dotnet.cmd publish /p:TargetArchitecture=wasm /p:TargetOS=Browser .\src\mono\sample\wasm\console-node\Wasm.Console.NodeSample.csproj -c Debug /p:ForNode=true`
3. `cd C:\runtime\src\mono\sample\wasm\console-node\bin\Debug\AppBundle\`
4. Run via `npm test`, `./run-node.sh` (or `run-node.cmd` if on windows) or `node runtime.js --run Wasm.Console.NodeSample.dll`

*Note:* The `/p:ForNode=true` is what enables the NodeJS support. Omitting it (or setting to any value other than `true`) will build as normal for v8 and this sample will not work as v8 does not support NPM packages. This was done for simplicity as this is only a quick demo.