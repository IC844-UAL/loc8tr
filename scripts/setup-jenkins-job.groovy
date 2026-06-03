// Run once in Jenkins Script Console (Manage Jenkins → Script Console)
// after creating the loc8tr-ci pipeline job manually, or use Job DSL plugin.

println "Create the pipeline job in the Jenkins UI:"
println "  New Item → Pipeline → name: loc8tr-ci"
println "  Pipeline script from SCM → Git"
println "  Repository: https://github.com/IC844-UAL/loc8tr.git"
println "  Branch: */main"
println "  Script Path: Jenkinsfile"
