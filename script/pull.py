# coding=utf-8
import sys
import subprocess 

# 输入日期
# 格式 20170616
date = sys.argv[1]

work_user = 'work'
work_serv = '192.168.60.59'
work_path = '/home/work/yangyoucun/performance/'
scp_prefix = 'scp ' + work_user + '@' + work_serv + ':' + work_path
target_path = './data/'

# 先拉取文件
for i in range(1, 3):
    file_name = date + '0' + str(i) + '.json'
    cmd = scp_prefix + file_name + ' ' + target_path
    subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)

# 然后做文件合并并删除两个源文件
# 只保留最后的文件
content = []
for i in range(1, 3):
    with open(target_path + date + '0' + str(i) + '.json') as f1:
        temp = f1.read().replace('\'', '')
        temp = eval(temp)
        content.extend(temp)

with open(target_path + date + '.json', 'w') as f:
    f.write(str(content))

for i in range(1, 3):
    file_name = date + '0' + str(i) + '.json'
    cmd = 'rm ' + target_path + file_name
    subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
