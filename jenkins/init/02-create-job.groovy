#!groovy
import jenkins.model.*
import org.jenkinsci.plugins.workflow.job.WorkflowJob
import org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition
import hudson.plugins.git.GitSCM
import hudson.plugins.git.BranchSpec
import hudson.plugins.git.UserRemoteConfig

def jenkins = Jenkins.getInstance()
def jobName = "loc8tr-ci"

if (jenkins.getItem(jobName) != null) {
    println "Job ${jobName} already exists"
    return
}

def job = jenkins.createProject(WorkflowJob.class, jobName)
def remote = new UserRemoteConfig(
    "https://github.com/IC844-UAL/loc8tr.git",
    null,
    null,
    null
)
def branch = new BranchSpec("*/main")
def scm = new GitSCM([remote], [branch], false, [], null, null, [])
def flow = new CpsScmFlowDefinition(scm, "Jenkinsfile")
job.setDefinition(flow)
job.description = "CI pipeline for loc8tr (install, syntax check, MongoDB, seed, API smoke test)"
job.save()

println "Created pipeline job: ${jobName}"
