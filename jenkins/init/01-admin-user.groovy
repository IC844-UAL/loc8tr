#!groovy
import jenkins.model.*
import hudson.security.*

def instance = Jenkins.getInstance()

def realm = new HudsonPrivateSecurityRealm(false)
if (realm.getUser("admin") == null) {
    realm.createAccount("admin", "admin123")
}
if (realm.getUser("profesor") == null) {
    realm.createAccount("profesor", "profesor123")
}
instance.setSecurityRealm(realm)

def strategy = new FullControlOnceLoggedInAuthorizationStrategy()
strategy.setAllowAnonymousRead(false)
instance.setAuthorizationStrategy(strategy)

instance.setCrumbIssuer(null)

instance.save()

println "Jenkins users created: admin / profesor (CSRF disabled for ngrok demo)"
