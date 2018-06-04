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
        sh """
        echo 'pushing to bluemix registry'
        withCredentials([string(credentialsId: 'PL_apikey', variable: 'PL_BX_API_KEY')]) {
        sh 'bx login -a https://api.au-syd.bluemix.net --apikey ${PL_BX_API_KEY}  -o ADMNextgen -s devtest'
      }
    }

  }
}
