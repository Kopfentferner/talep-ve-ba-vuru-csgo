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

const destekKategori = "1466029294097530942";
const basvuruKategori = "1253348803487076454";
const logKanal = "1466030876709359680";

const yetkiliRoller = [
"1466542588185149655",
"1253285883826929810"
];

let sayac = {
oneri:0,
soru:0,
ban:0,
admin:0,
vip:0
};

client.once("ready",()=>{
console.log(`${client.user.tag} aktif`);
});

/* PANEL KOMUTLARI */

client.on("messageCreate", async message => {

if(message.author.bot) return;

if(message.content === "!paneldestek"){

const embed = new EmbedBuilder()
.setTitle("🎫 Destek Sistemi")
.setDescription("İhtiyacınıza göre butona basarak talep açın.")
.setColor("Blue");

const row = new ActionRowBuilder().addComponents(

new ButtonBuilder()
.setCustomId("oneri")
.setLabel("Öneri")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("soru")
.setLabel("Soru")
.setStyle(ButtonStyle.Primary),

new ButtonBuilder()
.setCustomId("ban")
.setLabel("Ban İtiraz")
.setStyle(ButtonStyle.Danger)

);

message.channel.send({embeds:[embed],components:[row]});

}

if(message.content === "!panelbasvuru"){

const embed = new EmbedBuilder()
.setTitle("📋 Başvuru Paneli")
.setDescription("🛡 Admin Başvuru\n💎 VIP Başvuru")
.setColor("Purple");

const row = new ActionRowBuilder().addComponents(

new ButtonBuilder()
.setCustomId("admin")
.setLabel("Admin Başvuru")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("vip")
.setLabel("VIP Başvuru")
.setStyle(ButtonStyle.Primary)

);

message.channel.send({embeds:[embed],components:[row]});

}

});

/* BUTTON VE MODAL */

client.on("interactionCreate", async interaction => {

if(interaction.isButton()){

if(interaction.customId === "oneri"){

const modal = new ModalBuilder()
.setCustomId("oneriModal")
.setTitle("Öneri");

const input = new TextInputBuilder()
.setCustomId("oneriText")
.setLabel("Önerinizi yazınız")
.setStyle(TextInputStyle.Paragraph);

modal.addComponents(new ActionRowBuilder().addComponents(input));

interaction.showModal(modal);

}

if(interaction.customId === "soru"){

const modal = new ModalBuilder()
.setCustomId("soruModal")
.setTitle("Soru");

const input = new TextInputBuilder()
.setCustomId("soruText")
.setLabel("Sorunuzu yazınız")
.setStyle(TextInputStyle.Paragraph);

modal.addComponents(new ActionRowBuilder().addComponents(input));

interaction.showModal(modal);

}

if(interaction.customId === "ban"){

const modal = new ModalBuilder()
.setCustomId("banModal")
.setTitle("Ban İtiraz");

modal.addComponents(

new ActionRowBuilder().addComponents(
new TextInputBuilder()
.setCustomId("steam")
.setLabel("Steam profil link")
.setStyle(TextInputStyle.Short)
),

new ActionRowBuilder().addComponents(
new TextInputBuilder()
.setCustomId("neden")
.setLabel("Neden itiraz ediyorsunuz")
.setStyle(TextInputStyle.Paragraph)
)

);

interaction.showModal(modal);

}

if(interaction.customId === "admin"){

const modal = new ModalBuilder()
.setCustomId("adminModal")
.setTitle("Admin Başvuru");

modal.addComponents(

new ActionRowBuilder().addComponents(
new TextInputBuilder()
.setCustomId("steam")
.setLabel("Steam profil link")
.setStyle(TextInputStyle.Short)
),

new ActionRowBuilder().addComponents(
new TextInputBuilder()
.setCustomId("sure")
.setLabel("Sunucudaki süreniz")
.setStyle(TextInputStyle.Short)
),

new ActionRowBuilder().addComponents(
new TextInputBuilder()
.setCustomId("tw")
.setLabel("TW bakmayı biliyor musun")
.setStyle(TextInputStyle.Short)
)

);

interaction.showModal(modal);

}

if(interaction.customId === "vip"){

const modal = new ModalBuilder()
.setCustomId("vipModal")
.setTitle("VIP Başvuru");

modal.addComponents(

new ActionRowBuilder().addComponents(
new TextInputBuilder()
.setCustomId("steam")
.setLabel("Steam profil link")
.setStyle(TextInputStyle.Short)
),

new ActionRowBuilder().addComponents(
new TextInputBuilder()
.setCustomId("sure")
.setLabel("Sunucudaki süreniz")
.setStyle(TextInputStyle.Short)
)

);

interaction.showModal(modal);

}

/* TICKET KAPAT + FULL TRANSCRIPT */

if(interaction.customId === "kapat"){

const channel = interaction.channel;

const messages = await channel.messages.fetch({limit:100});

let html = `
<html>
<head>
<meta charset="UTF-8">
<style>
body{font-family:Arial;background:#2c2f33;color:white;padding:20px}
.message{margin-bottom:10px}
.author{font-weight:bold;color:#00b0f4}
</style>
</head>
<body>
<h2>Ticket Transcript</h2>
`;

messages.reverse().forEach(m=>{

html += `
<div class="message">
<span class="author">${m.author.tag}</span> :
<span>${m.content}</span>
</div>
`;

});

html += "</body></html>";

const buffer = Buffer.from(html,"utf8");

const log = await client.channels.fetch(logKanal);

log.send({
content:`📁 Ticket kapatıldı\n👮 Kapatan Yetkili: ${interaction.user}`,
files:[{attachment:buffer,name:"transcript.html"}]
});

interaction.reply({content:"Ticket kapatılıyor...",ephemeral:true});

setTimeout(()=>channel.delete(),3000);

}

}

/* MODAL SUBMIT */

if(interaction.isModalSubmit()){

let kategori;
let isim;
let mesaj="";

if(interaction.customId==="oneriModal"){
sayac.oneri++;
kategori=destekKategori;
isim=`öneri-${sayac.oneri}`;

const oneri=interaction.fields.getTextInputValue("oneriText");

mesaj=`📌 Öneri\n\n${interaction.user}\n\n${oneri}`;
}

if(interaction.customId==="soruModal"){
sayac.soru++;
kategori=destekKategori;
isim=`soru-${sayac.soru}`;

const soru=interaction.fields.getTextInputValue("soruText");

mesaj=`❓ Soru\n\n${interaction.user}\n\n${soru}`;
}

if(interaction.customId==="banModal"){
sayac.ban++;
kategori=destekKategori;
isim=`banitiraz-${sayac.ban}`;

const steam=interaction.fields.getTextInputValue("steam");
const neden=interaction.fields.getTextInputValue("neden");

mesaj=`🚫 Ban İtiraz\n\nKullanıcı: ${interaction.user}\nSteam: ${steam}\nSebep: ${neden}`;
}

if(interaction.customId==="adminModal"){
sayac.admin++;
kategori=basvuruKategori;
isim=`adminbasvuru-${sayac.admin}`;

const steam=interaction.fields.getTextInputValue("steam");
const sure=interaction.fields.getTextInputValue("sure");
const tw=interaction.fields.getTextInputValue("tw");

mesaj=`🛡 Admin Başvuru\n\nKullanıcı: ${interaction.user}\nSteam: ${steam}\nSüre: ${sure}\nTW: ${tw}`;
}

if(interaction.customId==="vipModal"){
sayac.vip++;
kategori=basvuruKategori;
isim=`vipbasvuru-${sayac.vip}`;

const steam=interaction.fields.getTextInputValue("steam");
const sure=interaction.fields.getTextInputValue("sure");

mesaj=`💎 VIP Başvuru\n\nKullanıcı: ${interaction.user}\nSteam: ${steam}\nSüre: ${sure}`;
}

const channel=await interaction.guild.channels.create({
name:isim,
type:ChannelType.GuildText,
parent:kategori,
permissionOverwrites:[
{
id:interaction.guild.id,
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

const closeButton=new ActionRowBuilder().addComponents(
new ButtonBuilder()
.setCustomId("kapat")
.setLabel("Ticket Kapat")
.setStyle(ButtonStyle.Danger)
);

channel.send({content:mesaj,components:[closeButton]});

interaction.reply({
content:`Talebiniz oluşturuldu: ${channel}`,
ephemeral:true
});

}

});

client.login(process.env.TOKEN);