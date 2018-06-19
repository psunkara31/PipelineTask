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
   
   // stage('push to bluemix registry')
  //  {
      
   //   steps
    //  {
   //     echo 'pushing to bluemix registry'
   //     withCredentials([string(credentialsId: 'API_KEY', variable: 'PL_BX_API_KEY')]) 
   //     {
   //       sh 'bx login -a https://api.au-syd.bluemix.net --apikey ${PL_BX_API_KEY}  -o ADMNextgen -s devtest'
   //       sh 'docker push registry.au-syd.bluemix.net/liberty_syd/filetest:1.0'
   //       sh 'echo image pushed to bluemix registry'
   //     }
   //   }
   // }
     stage("update jira"){
                agent 
                 {
                     label 'Slave-1'
                 }
                steps{
                  script{
                    step([$class: 'hudson.plugins.jira.JiraIssueUpdater', 
                    issueSelector: [$class: 'hudson.plugins.jira.selector.DefaultIssueSelector'],
                    scm: [$class: 'GitSCM', branches: [[name: '*/master']], 
                     userRemoteConfigs: [[url: 'https://github.com/psunkara31/PipelineTask.git']]]]) 
                  }
                }
            } 
  } 

  post
  {
    success {
       
        slackSend channel: '#appmonitoring',
                  color: 'good',
                  teamDomain: 'projectliberty',
                 // token: 'pl_slack',
                  message: "The pipeline ${currentBuild.fullDisplayName} completed successfully."

           }
   
  }
}
