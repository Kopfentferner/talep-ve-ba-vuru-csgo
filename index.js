const { 
Client,
GatewayIntentBits,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle,
EmbedBuilder,
ModalBuilder,
TextInputBuilder,
TextInputStyle,
ChannelType,
PermissionsBitField
} = require("discord.js");

const express = require("express");
const app = express();

app.get("/", (req,res)=>res.send("Bot aktif"));
app.listen(3000);

const client = new Client({
intents:[
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent,
GatewayIntentBits.GuildMembers
]});

const yetkiliRoller = [
"1466542588185149655",
"1253285883826929810"
];

const destekKategori = "1466029294097530942";
const basvuruKategori = "1253348803487076454";

let sayac = {
onerı:0,
soru:0,
ban:0,
admin:0,
vip:0
};

client.once("ready",()=>{
console.log(`${client.user.tag} aktif`);
});

client.on("interactionCreate", async interaction => {

if(interaction.isButton()){

if(interaction.customId === "oneri"){

const modal = new ModalBuilder()
.setCustomId("oneriModal")
.setTitle("Öneri Yaz");

const input = new TextInputBuilder()
.setCustomId("oneriText")
.setLabel("Önerinizi yazınız")
.setStyle(TextInputStyle.Paragraph)
.setRequired(true);

modal.addComponents(
new ActionRowBuilder().addComponents(input)
);

await interaction.showModal(modal);

}

if(interaction.customId === "soru"){

const modal = new ModalBuilder()
.setCustomId("soruModal")
.setTitle("Soru Sor");

const input = new TextInputBuilder()
.setCustomId("soruText")
.setLabel("Sorunuzu yazınız")
.setStyle(TextInputStyle.Paragraph);

modal.addComponents(
new ActionRowBuilder().addComponents(input)
);

await interaction.showModal(modal);

}

if(interaction.customId === "ban"){

const modal = new ModalBuilder()
.setCustomId("banModal")
.setTitle("Ban İtiraz");

const steam = new TextInputBuilder()
.setCustomId("steam")
.setLabel("Steam Profil Link")
.setStyle(TextInputStyle.Short);

const neden = new TextInputBuilder()
.setCustomId("neden")
.setLabel("Neden itiraz ediyorsunuz")
.setStyle(TextInputStyle.Paragraph);

modal.addComponents(
new ActionRowBuilder().addComponents(steam),
new ActionRowBuilder().addComponents(neden)
);

await interaction.showModal(modal);

}

if(interaction.customId === "admin"){

const modal = new ModalBuilder()
.setCustomId("adminModal")
.setTitle("Admin Başvuru");

modal.addComponents(
new ActionRowBuilder().addComponents(
new TextInputBuilder()
.setCustomId("steam")
.setLabel("Steam profil linki")
.setStyle(TextInputStyle.Short)
),
new ActionRowBuilder().addComponents(
new TextInputBuilder()
.setCustomId("sure")
.setLabel("SW deki süreniz (!sürem)")
.setStyle(TextInputStyle.Short)
),
new ActionRowBuilder().addComponents(
new TextInputBuilder()
.setCustomId("tw")
.setLabel("TW bakmayı biliyor musun?")
.setStyle(TextInputStyle.Short)
)
);

await interaction.showModal(modal);

}

if(interaction.customId === "vip"){

const modal = new ModalBuilder()
.setCustomId("vipModal")
.setTitle("VIP Başvuru");

modal.addComponents(
new ActionRowBuilder().addComponents(
new TextInputBuilder()
.setCustomId("steam")
.setLabel("Steam profil linki")
.setStyle(TextInputStyle.Short)
),
new ActionRowBuilder().addComponents(
new TextInputBuilder()
.setCustomId("sure")
.setLabel("SW deki süreniz")
.setStyle(TextInputStyle.Short)
)
);

await interaction.showModal(modal);

}

}

if(interaction.isModalSubmit()){

const guild = interaction.guild;

let kategori;
let isim;

if(interaction.customId === "oneriModal"){
sayac.onerı++;
kategori = destekKategori;
isim = `öneri-${sayac.onerı}`;
}

if(interaction.customId === "soruModal"){
sayac.soru++;
kategori = destekKategori;
isim = `soru-${sayac.soru}`;
}

if(interaction.customId === "banModal"){
sayac.ban++;
kategori = destekKategori;
isim = `banitiraz-${sayac.ban}`;
}

if(interaction.customId === "adminModal"){
sayac.admin++;
kategori = basvuruKategori;
isim = `adminbasvuru-${sayac.admin}`;
}

if(interaction.customId === "vipModal"){
sayac.vip++;
kategori = basvuruKategori;
isim = `vipbasvuru-${sayac.vip}`;
}

const channel = await guild.channels.create({
name:isim,
type:ChannelType.GuildText,
parent:kategori,
permissionOverwrites:[
{
id:guild.id,
deny:[PermissionsBitField.Flags.ViewChannel]
},
{
id:interaction.user.id,
allow:[PermissionsBitField.Flags.ViewChannel]
},
...yetkiliRoller.map(id=>({
id:id,
allow:[PermissionsBitField.Flags.ViewChannel]
}))
]
});

await channel.send(`Talep sahibi: ${interaction.user}`);

await interaction.reply({
content:`Talebiniz oluşturuldu: ${channel}`,
ephemeral:true
});

}

});

client.login(process.env.TOKEN);