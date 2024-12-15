<template>
  <div>
    <div class="position">我的Offer</div>
    <el-row :gutter="20">
      <el-col :span="5" v-for="(item, index) in offers" :key="index" >
        <el-card :body-style="{ padding: '2px' }">
          <div style="padding: 14px;">
            <div>
              <span>雇主:</span> <span>{{item.contents.publisher}}</span>
            </div>
            <div>
              <span>JD文件:</span> <el-link :href="'https://aggregator.walrus-testnet.walrus.space/v1/'+item.contents.desc">下载文件</el-link>
            </div>
            <div><span>Offer截止时间:</span>{{showDeadLine(item.contents.deadline_ms)}}</div>
            <div class="bottom clearfix">
              <el-button type="success" >
                <el-link :href="`https://suivision.xyz/object/`+item.id" target="_blank">查看</el-link>
              </el-button>
              <el-button type="success" @click="signContract(item)">
                签合同
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>

  <div>
    <div class="position">我的合同</div>
    <el-row :gutter="20">
      <el-col :span="5" v-for="(item, index) in contracts" :key="index" >
        <el-card :body-style="{ padding: '2px' }">
          <div style="padding: 14px;">
            <div>
              <span>雇主:</span> <span>{{item.contents.employer}}</span>
            </div>
            <div>
              <span>Offer:</span> <span>{{item.contents.offer_id}}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>

  <n-button @click="refresh">刷新</n-button>
</template>

<script setup>
import {useWalletQuery,useWalletState,useWalletActions} from "suiue";
import {ElCard, ElRow, ElButton, ElCol, ElMessage} from "element-plus";
import { ref,watch } from "vue";
const {objects,loadAllObjects} = useWalletQuery();
const {isConnected,address} = useWalletState();


watch(isConnected,(Value)=>{
  if (Value){
    refresh()
  }
},{deep:true,immediate:false})


const offers = ref([])

const contracts = ref([])

const refresh = ()=>{
  loadAllObjects();
  offers.value = filteredOffers();
  contracts.value = filteredContracts();
}

const filteredOffers = () => {
  const result = []
  for (const key in objects) {
    for (const obj of objects[key]) {
      if (obj.type=="0x5288956e80169697c8ce0e268bb6361963d69b2bc5041857d8427772baee1bbb::offer::Offer"){ //  证书合约
        result.push(obj)
      }
    }
  }
  console.log("Offers",result)
  return result
}

const filteredContracts = () => {
  const result = []
  for (const key in objects) {
    for (const obj of objects[key]) {
      if (obj.type=="0x5288956e80169697c8ce0e268bb6361963d69b2bc5041857d8427772baee1bbb::offer::Contract") {
        result.push(obj)
      }// 合同
    }
  }
  console.log("Contracts",result)
  return result
}

import {TransactionBlock} from "@mysten/sui.js/transactions";
const {signAndExecuteTransactionBlock} = useWalletActions()


const showDeadLine=(deadLineMs)=>{
  const d = new Date(Number(deadLineMs));
  const DD = String(d.getDate()).padStart(2, '0'); // 获取日
  const MM = String(d.getMonth() + 1).padStart(2, '0'); //获取月份，1 月为 0
  const yyyy = d.getFullYear(); // 获取年

// 时间
  const hh =  String(d.getHours()).padStart(2, '0');       //获取当前小时数(0-23)
  const mm = String(d.getMinutes()).padStart(2, '0');     //获取当前分钟数(0-59)
  const ss = String(d.getSeconds()).padStart(2, '0');     //获取当前秒数(0-59)
  const today = yyyy + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss;
  return today
}
import {updateContractDigest} from "@/api/employee/employee.go"
const signContract=(data)=>{
  if (!isConnected.value){
    ElMessage({
      type: 'error',
      message: '先连接钱包'
    })
    return
  }
  const txb = new TransactionBlock()
  txb.moveCall({
    target: `0x5288956e80169697c8ce0e268bb6361963d69b2bc5041857d8427772baee1bbb::offer::sign_offer`,
    arguments: [
      txb.object('0x6'),
      txb.object(data.id),
    ],
    typeArguments: []
  })
  signAndExecuteTransactionBlock(txb).then((digest)=>{
    console.log(digest)
    updateContractDigest({
      publishAddress: data.contents.publisher,
      employeeAddress:address.value,
      digest: digest.digest,
    }).then((res)=>{
      console.log(res)
    })
  })
};
</script>
