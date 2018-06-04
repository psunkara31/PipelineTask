pipeline
{
  agent none
  stages
  {	
    stage('git checkout')
     {
       agent 
       {
           label 'BB-Slave'
       }
       steps{
              echo "checkout from git"
	          checkout scm
             } 
     } 
  }
}
