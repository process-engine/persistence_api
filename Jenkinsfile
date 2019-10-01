#!/usr/bin/env groovy

def cleanup_workspace() {
  cleanWs()
  dir("${env.WORKSPACE}@tmp") {
    deleteDir()
  }
  dir("${env.WORKSPACE}@script") {
    deleteDir()
  }
  dir("${env.WORKSPACE}@script@tmp") {
    deleteDir()
  }
}

def buildIsRequired = true

pipeline {
  agent any
  options {
    buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '20'))
  }
  tools {
    nodejs "node-lts"
  }
  environment {
    NPM_RC_FILE = 'process-engine-ci-token'
    NODE_JS_VERSION = 'node-lts'
  }

  stages {
    stage('Check if build is required') {
      steps {
        script {
          // Taken from https://stackoverflow.com/questions/37755586/how-do-you-pull-git-committer-information-for-jenkins-pipeline
          sh 'git --no-pager show -s --format=\'%an\' > commit-author.txt'
          def commitAuthorName = readFile('commit-author.txt').trim()

          def ciAdminName = "admin" // jenkins will set this name after every restart, so we need to look out for this.
          def ciUserName = "process-engine-ci"

          echo(commitAuthorName)
          echo("Commiter is process-engine-ci: ${commitAuthorName == ciUserName || commitAuthorName == ciAdminName}")

          buildIsRequired = commitAuthorName != ciAdminName && commitAuthorName != ciUserName

          if (!buildIsRequired) {
            echo("Commit was made by process-engine-ci. Skipping build.")
          }
        }
      }
    }
    stage('Install dependencies') {
      when {
        expression {buildIsRequired == true}
      }
      steps {
        nodejs(configId: env.NPM_RC_FILE, nodeJSInstallationName: env.NODE_JS_VERSION) {
          sh('node --version')
          sh('npm install --no-package-lock')
        }
      }
    }
    stage('Build Contracts') {
      steps {
        dir('persistence_api.contracts') {
          sh('node --version')
          sh('npm run build')
        }
      }
    }
    stage('Lint Contracts') {
      steps {
        dir('persistence_api.contracts') {
          sh('node --version')
          sh('npm run lint')
        }
      }
    }
    stage('Build layers') {
      when {
        expression {buildIsRequired == true}
      }
      parallel {
        stage('UseCases') {
          stages {
            stage('Build Sources') {
              steps {
                dir('persistence_api.use_cases') {
                  sh('node --version')
                  sh('npm run build')
                }
              }
            }
            stage('Lint sources') {
              steps {
                dir('persistence_api.use_cases') {
                  sh('node --version')
                  sh('npm run lint')
                }
              }
            }
            stage('Execute tests') {
              steps {
                dir('persistence_api.use_cases') {
                  sh('node --version')
                  sh('npm run test')
                }
              }
            }
          }
        }
        stage('Services') {
          stages {
            stage('Build Sources') {
              steps {
                dir('persistence_api.services') {
                  sh('node --version')
                  sh('npm run build')
                }
              }
            }
            stage('Lint sources') {
              steps {
                dir('persistence_api.services') {
                  sh('node --version')
                  sh('npm run lint')
                }
              }
            }
            stage('Execute tests') {
              steps {
                dir('persistence_api.services') {
                  sh('node --version')
                  sh('npm run test')
                }
              }
            }
          }
        }
        stage('Repositories') {
          stages {
            stage('Build Sources') {
              steps {
                dir('persistence_api.repositories.sequelize') {
                  sh('node --version')
                  sh('npm run build')
                }
              }
            }
            stage('Lint sources') {
              steps {
                dir('persistence_api.repositories.sequelize') {
                  sh('node --version')
                  sh('npm run lint')
                }
              }
            }
            stage('Execute tests') {
              steps {
                dir('persistence_api.repositories.sequelize') {
                  sh('node --version')
                  sh('npm run test')
                }
              }
            }
          }
        }
      }
    }
    stage('Publish packages') {
      parallel {
        stage('Contracts') {
          stages {
            stage('Set package version') {
              steps {
                dir('persistence_api.contracts') {
                  sh('node --version')
                  sh('node ./node_modules/.bin/ci_tools prepare-version --allow-dirty-workdir');
                }
              }
            }
            stage('Publish to npm') {
              steps {
                dir('persistence_api.contracts') {
                  nodejs(configId: env.NPM_RC_FILE, nodeJSInstallationName: env.NODE_JS_VERSION) {
                    sh('node ./node_modules/.bin/ci_tools publish-npm-package --create-tag-from-branch-name')
                  }
                }
              }
            }
            stage('Publish to GitHub') {
              when {
                anyOf {
                  branch "beta"
                  branch "develop"
                  branch "master"
                }
              }
              steps {
                dir('persistence_api.contracts') {
                  withCredentials([
                    usernamePassword(credentialsId: 'process-engine-ci_github-token', passwordVariable: 'GH_TOKEN', usernameVariable: 'GH_USER')
                  ]) {
                    sh('node ./node_modules/.bin/ci_tools commit-and-tag-version --only-on-primary-branches')
                    sh('node ./node_modules/.bin/ci_tools update-github-release --only-on-primary-branches --use-title-and-text-from-git-tag');
                  }
                }
              }
            }
          }
        }
        stage('UseCases') {
          stages {
            stage('Set package version') {
              steps {
                dir('persistence_api.use_cases') {
                  sh('node --version')
                  sh('node ./node_modules/.bin/ci_tools prepare-version --allow-dirty-workdir');
                }
              }
            }
            stage('Publish to npm') {
              steps {
                dir('persistence_api.use_cases') {
                  nodejs(configId: env.NPM_RC_FILE, nodeJSInstallationName: env.NODE_JS_VERSION) {
                    sh('node ./node_modules/.bin/ci_tools publish-npm-package --create-tag-from-branch-name')
                  }
                }
              }
            }
            stage('Publish to GitHub') {
              when {
                anyOf {
                  branch "beta"
                  branch "develop"
                  branch "master"
                }
              }
              steps {
                dir('persistence_api.use_cases') {
                  withCredentials([
                    usernamePassword(credentialsId: 'process-engine-ci_github-token', passwordVariable: 'GH_TOKEN', usernameVariable: 'GH_USER')
                  ]) {
                    sh('node ./node_modules/.bin/ci_tools commit-and-tag-version --only-on-primary-branches')
                    sh('node ./node_modules/.bin/ci_tools update-github-release --only-on-primary-branches --use-title-and-text-from-git-tag');
                  }
                }
              }
            }
          }
        }
        stage('Services') {
          stages {
            stage('Set package version') {
              steps {
                dir('persistence_api.services') {
                  sh('node --version')
                  sh('node ./node_modules/.bin/ci_tools prepare-version --allow-dirty-workdir');
                }
              }
            }
            stage('Publish to npm') {
              steps {
                dir('persistence_api.services') {
                  nodejs(configId: env.NPM_RC_FILE, nodeJSInstallationName: env.NODE_JS_VERSION) {
                    sh('node ./node_modules/.bin/ci_tools publish-npm-package --create-tag-from-branch-name')
                  }
                }
              }
            }
            stage('Publish to GitHub') {
              when {
                anyOf {
                  branch "beta"
                  branch "develop"
                  branch "master"
                }
              }
              steps {
                dir('persistence_api.services') {
                  withCredentials([
                    usernamePassword(credentialsId: 'process-engine-ci_github-token', passwordVariable: 'GH_TOKEN', usernameVariable: 'GH_USER')
                  ]) {
                    sh('node ./node_modules/.bin/ci_tools commit-and-tag-version --only-on-primary-branches')
                    sh('node ./node_modules/.bin/ci_tools update-github-release --only-on-primary-branches --use-title-and-text-from-git-tag');
                  }
                }
              }
            }
          }
        }
        stage('Repositories') {
          stages {
            stage('Set package version') {
              steps {
                dir('persistence_api.repositories.sequelize') {
                  sh('node --version')
                  sh('node ./node_modules/.bin/ci_tools prepare-version --allow-dirty-workdir');
                }
              }
            }
            stage('Publish to npm') {
              steps {
                dir('persistence_api.repositories.sequelize') {
                  nodejs(configId: env.NPM_RC_FILE, nodeJSInstallationName: env.NODE_JS_VERSION) {
                    sh('node ./node_modules/.bin/ci_tools publish-npm-package --create-tag-from-branch-name')
                  }
                }
              }
            }
            stage('Publish to GitHub') {
              when {
                anyOf {
                  branch "beta"
                  branch "develop"
                  branch "master"
                }
              }
              steps {
                dir('persistence_api.repositories.sequelize') {
                  withCredentials([
                    usernamePassword(credentialsId: 'process-engine-ci_github-token', passwordVariable: 'GH_TOKEN', usernameVariable: 'GH_USER')
                  ]) {
                    sh('node ./node_modules/.bin/ci_tools commit-and-tag-version --only-on-primary-branches')
                    sh('node ./node_modules/.bin/ci_tools update-github-release --only-on-primary-branches --use-title-and-text-from-git-tag');
                  }
                }
              }
            }
          }
        }
      }
    }
    stage('Cleanup') {
      when {
        expression {buildIsRequired == true}
      }
      steps {
        script {
          // this stage just exists, so the cleanup-work that happens in the post-script
          // will show up in its own stage in Blue Ocean
          sh(script: ':', returnStdout: true);
        }
      }
    }
  }
  post {
    always {
      script {
        cleanup_workspace();
      }
    }
  }
}
