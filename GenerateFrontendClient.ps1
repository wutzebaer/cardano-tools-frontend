rm -r -fo src/cardano-tools-client
java -jar swagger-codegen-cli.jar generate -i http://localhost:8080/v3/api-docs -l typescript-angular -o src/cardano-tools-client

$file = 'src\cardano-tools-client\api.module.ts'
$find = 'public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {'
$replace = 'public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {'
(Get-Content $file).replace($find, $replace) | Set-Content $file

pause