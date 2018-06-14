pipeline
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
    stage('JIra update')
    {
      agent
      {
        label 'CBS-Slave'
      }
      steps
      {
        step([$class: 'hudson.plugins.jira.JiraIssueUpdater', 
         issueSelector: [$class: 'hudson.plugins.jira.selector.DefaultIssueSelector'], 
         scm: [$class: 'GitSCM', branches: [[name: '*/master']]]])
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
                    pushVersion: 'pooh',
                    baseDir: 'workspace//jenfiletest',
                             ]
                              ],
                    deploy: [
                 $class: 'com.urbancode.jenkins.plugins.ucdeploy.DeployHelper$DeployBlock',
                 deployApp: 'PORTAL',
                 deployEnv: 'Dev',
                 deployProc: 'Sonarqube',
                 deployVersions: 'Sonarqube-k8s:pooh',
                 deployOnlyChanged: false
                         ]
                           ])
        
      }
    }
 }
}
