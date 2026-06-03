#!groovy
import jenkins.model.*
import jenkins.model.JenkinsLocationConfiguration

def instance = Jenkins.getInstance()
def publicUrl = System.getenv("JENKINS_PUBLIC_URL")

if (publicUrl) {
    if (!publicUrl.endsWith("/")) {
        publicUrl = publicUrl + "/"
    }
    def location = JenkinsLocationConfiguration.get()
    location.setUrl(publicUrl)
    location.save()
    println "Jenkins public URL set to ${publicUrl}"
}

instance.save()
