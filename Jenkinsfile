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
          echo 'building docker image'
          docker.build('filetestimage')
      }
  }
}
