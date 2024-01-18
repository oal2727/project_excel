const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient()
async function main() {

  await prisma.$executeRaw`DBCC CHECKIDENT ('asegurado_suscripcion', RESEED, 20001);`

    await prisma.asegurado_suscripcion.createMany({
        data: [
          { preg1: 'S', preg2: 'N', preg3: 'N', preg4: 'N', preg5: 'S' },
          { preg1: 'N', preg2: 'N', preg3: 'N', preg4: 'N', preg5: 'S' },
          { preg1: null, preg2: null, preg3: null, preg4: null, preg5: null },
          { preg1: null, preg2: null, preg3: null, preg4: null, preg5: null },
          { preg1: null, preg2: null, preg3: null, preg4: null, preg5: null },
          { preg1: null, preg2: null, preg3: null, preg4: null, preg5: null },
        ],
      });

      await prisma.certificado.createMany({
        data: [
          { nroCertificado: '100001', idContratante: 201, idAsegurado_suscripcion: 20001, contratoPropuesta: '321654' },
          { nroCertificado: '100002', idContratante: 332, idAsegurado_suscripcion: 20002, contratoPropuesta: '855452' },
          { nroCertificado: '100003', idContratante: 602, idAsegurado_suscripcion: 20003, contratoPropuesta: '123456' },
          { nroCertificado: '100004', idContratante: 844, idAsegurado_suscripcion: 20004, contratoPropuesta: '789101' },
          { nroCertificado: '100005', idContratante: 222, idAsegurado_suscripcion: 20005, contratoPropuesta: '567891' },
          { nroCertificado: '100006', idContratante: 145, idAsegurado_suscripcion: 20006, contratoPropuesta: '246810' },
        ],
      });

      await prisma.suscripcion_detalle.createMany({
        data: [
          { pregunta: 'P1', descripcion: 'Asma', idAseg_suscripcion: 20001 },
          { pregunta: 'P5', descripcion: 'Diabetes', idAseg_suscripcion: 20001 },
          { pregunta: 'P5', descripcion: 'Artritis', idAseg_suscripcion: 20002 },
        ],
      });
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})