import os
import subprocess

os.environ['GIT_AUTHOR_NAME'] = 'samyuktaap'
os.environ['GIT_AUTHOR_EMAIL'] = 'samyuktaaabhi1712@gmail.com'
os.environ['GIT_COMMITTER_NAME'] = 'samyuktaap'
os.environ['GIT_COMMITTER_EMAIL'] = 'samyuktaaabhi1712@gmail.com'

subprocess.run('git rebase -r --root --exec "git commit --amend --no-edit --reset-author"', shell=True)
