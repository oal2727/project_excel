const {PrismaClient} = require("@prisma/client")
const express = require("express");
const app = express.Router()
// const {verifyToken} = require("../../middleware/auth")

const prisma = new PrismaClient()

app.get("/list",async(req,res)=>{

  const typeDescriptionDetail =(question,detail)=>{
    switch(question){
      case "S":
        return detail[0].descripcion
      case "N":
        return "N"
      default:
        return "-"
    }
  }

const list = await prisma.asegurado_suscripcion.findMany({
  include:{
    certificado:true,
    suscripcion_detalle:true
  }
})
const listUpdate = list.map((item)=>{
  return{
    numberCertificate:item.certificado[0].nroCertificado,
    contract:item.certificado[0].contratoPropuesta,
    question1:typeDescriptionDetail(item.preg1,item.suscripcion_detalle),
    question2:typeDescriptionDetail(item.preg2,item.suscripcion_detalle),
    question3:typeDescriptionDetail(item.preg3,item.suscripcion_detalle),
    question4:typeDescriptionDetail(item.preg4,item.suscripcion_detalle),
    question5:typeDescriptionDetail(item.preg5,item.suscripcion_detalle),
  }
})
  return res.status(200).json(listUpdate)
})


app.post("/save",async(req,res)=>{
  const body = req.body
  const findContract = await prisma.certificado.findFirst({
    where:{
      contratoPropuesta: {
        in: body.map((item) => String(item.ContratoPropuesto))
      }
    }
  })
  if(findContract){
    return res.status(400).json({message:"Contrato ya existe"})
  }

  const findNumCertificado = await prisma.certificado.findFirst({
    where:{
      nroCertificado: {
        in: body.map((item) => String(item.NumCertificado))
      }
    }
  })
  if(findNumCertificado){
    return res.status(400).json({message:"Numero Certificado ya existe"})
  }

  body.map(async(item)=>{
  const asegurado =  await prisma.asegurado_suscripcion.create({
      data:{
        preg1:item.p1,
        preg2:item.p2,
        preg3:item.p3,
        preg4:item.p4,
        preg5:item.p5
      }
    })

      if(item.p1 == "S"){
        suscripcionDetalle = {
          pregunta:"P1",
          descripcion:item.Descripcion1,
          idAseg_suscripcion:asegurado.idAseg_suscripcion
        }
      }
      else if(item.p2 == "S"){
        suscripcionDetalle = {
          pregunta:"P2",
          descripcion:item.Descripcion2,
          idAseg_suscripcion:asegurado.idAseg_suscripcion
        }
      }
      else if(item.p3 == "S"){
        suscripcionDetalle = {
          pregunta:"P3",
          descripcion:item.Descripcion3,
          idAseg_suscripcion:asegurado.idAseg_suscripcion
        }
      }
      else if(item.p4 == "S"){
        suscripcionDetalle = {
          pregunta:"P4",
          descripcion:item.Descripcion4,
          idAseg_suscripcion:asegurado.idAseg_suscripcion
        }
      }
      else if(item.p5 == "S"){
        suscripcionDetalle = {
          pregunta:"P5",
          descripcion:item.Descripcion5,
          idAseg_suscripcion:asegurado.idAseg_suscripcion
        }
      }
      await prisma.suscripcion_detalle.create({
        data:suscripcionDetalle
      })
   
      await prisma.certificado.create({
          data:{
            nroCertificado:String(item.NumCertificado),
            idAsegurado_suscripcion:asegurado.idAseg_suscripcion,
            contratoPropuesta:String(item.ContratoPropuesto)
          }
      })
  })
  return res.status(200).json({message:"Numero Certificado ya existe"})
})


module.exports = app;