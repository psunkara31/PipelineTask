node
{
  agent none
  stages
  { 
    stage('git checkout')
     {
       agent 
       {
           label 'DockerIO'
       }
       steps{
              echo "checkout from git"
        checkout scm
             } 
     } 
    stage('Docker image Build') 
      {
         agent
          {
             label 'DockerIO'
          }
          steps{
                 sh """
                 echo 'building docker image'
                 docker build -t filetestimage .
                 docker tag filetestimage registry.au-syd.bluemix.net/liberty_syd/filetest:1.0
                 """
                } 
      }

    stage('docker unit tests')
    {
      agent
      {
        label 'DockerIO'
      }
      steps{
             sh """
             echo 'docker unit testing step'
             structure-test -test.v -image registry.au-syd.bluemix.net/liberty_syd/filetest:1.0 file_tests.yaml
             """
           }
    } 

    stage('push to bluemix registry')
    {
      agent
      {
        label 'DockerIO'
      }
      steps
      {
        echo 'pushing to bluemix registry'
        withCredentials([string(credentialsId: 'API_KEY', variable: 'PL_BX_API_KEY')]) 
        {
          sh 'bx login -a https://api.au-syd.bluemix.net --apikey ${PL_BX_API_KEY}  -o ADMNextgen -s devtest'
          sh 'docker push registry.au-syd.bluemix.net/liberty_syd/filetest:1.0'
          sh 'echo image pushed to bluemix registry'
        }
      }
    }
    
    stage('deploy through ucd')
    {
      agent
      {
        label 'CBS-Slave'
      }
      steps
      {
        echo 'started deploying in UCD'
                    step([  $class: 'UCDeployPublisher',
                    siteName: 'IBM GBS UCD',
                    component: [
                    $class: 'com.urbancode.jenkins.plugins.ucdeploy.VersionHelper$VersionBlock',
                    componentName: 'Sonarqube-k8s',
                    delivery: [
                    $class: 'com.urbancode.jenkins.plugins.ucdeploy.DeliveryHelper$Push',
                    pushVersion: 'win5',
                    baseDir: 'workspace//Project_Liberty//K8s-Infrasetup//PL_Infra//jiratest',
                             ]
                              ],
                    deploy: [
                 $class: 'com.urbancode.jenkins.plugins.ucdeploy.DeployHelper$DeployBlock',
                 deployApp: 'PORTAL',
                 deployEnv: 'Dev',
                 deployProc: 'Sonarqube',
                 deployVersions: 'Sonarqube-k8s:win5',
                 deployOnlyChanged: false
                         ]
                           ])
        
      }
    }
    
    stage('Jira update')
    {
      steps([$class: 'hudson.plugins.jira.JiraIssueUpdater', 
    issueSelector: [$class: 'hudson.plugins.jira.selector.DefaultIssueSelector'], 
    scm: [$class: 'GitSCM', branches: [[name: '*/master']], 
        userRemoteConfigs: [[url: 'https://github.com/psunkara31/PipelineTask.git']]]])

    }
 }
 
 post 
  {
    success
    {
      updateJira(${BUILD_NUMBER});

        mail to: 'psunkara@in.ibm.com',
             subject: "Succeeded Pipeline: ${currentBuild.fullDisplayName}",
             body: "The pipeline ${currentBuild.fullDisplayName} completed successfully"

      
    }
  }
  
}
def updateJira(build) {
    def jiraIssues = jiraIssueSelector(issueSelector: [$class: 'DefaultIssueSelector'])
    jiraIssues.each { issue ->
    jiraAddComment comment: "{panel:bgColor=#97FF94}{code}Code was added to address this issue in build ${build}{code} {panel}", idOrKey: issue, site: jiraServer
    def fixedInBuild = [fields: [customfield_10121: build]] // This is a custom field named "Fixed in Build"
        jiraEditIssue idOrKey: issue, issue: fixedInBuild
    }
  }
