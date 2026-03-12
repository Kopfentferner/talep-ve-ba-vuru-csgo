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

client.on("messageCreate", async message => {

if(message.author.bot) return;

/* DESTEK PANEL */

if(message.content === "!paneldestek"){

const embed = new EmbedBuilder()
.setTitle("🎫 Destek Sistemi")
.setDescription("Lütfen ihtiyacınıza yönelik butonu kullanarak talep oluşturun.")
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

message.channel.send({
embeds:[embed],
components:[row]
});

}

/* BAŞVURU PANEL */

if(message.content === "!panelbasvuru"){

const embed = new EmbedBuilder()
.setTitle("📋 Başvuru Paneli")
.setDescription("🛡 Admin Başvuru → Ücretli ve Ücretsiz Yetki için\n💎 VIP Başvuru → Ücretsiz ve Ücretli VIP için")
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

message.channel.send({
embeds:[embed],
components:[row]
});

}

});

/* BUTTON VE MODAL */

client.on("interactionCreate", async interaction => {

if(interaction.isButton()){

/* ÖNERİ */

if(interaction.customId === "oneri"){

const modal = new ModalBuilder()
.setCustomId("oneriModal")
.setTitle("Öneri");

const input = new TextInputBuilder()
.setCustomId("oneriText")
.setLabel("Önerinizi yazınız")
.setStyle(TextInputStyle.Paragraph);

modal.addComponents(
new ActionRowBuilder().addComponents(input)
);

interaction.showModal(modal);

}

/* SORU */

if(interaction.customId === "soru"){

const modal = new ModalBuilder()
.setCustomId("soruModal")
.setTitle("Soru");

const input = new TextInputBuilder()
.setCustomId("soruText")
.setLabel("Sorunuzu yazınız")
.setStyle(TextInputStyle.Paragraph);

modal.addComponents(
new ActionRowBuilder().addComponents(input)
);

interaction.showModal(modal);

}

/* BAN İTİRAZ */

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

/* ADMIN BAŞVURU */

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
.setLabel("SW deki süreniz")
.setStyle(TextInputStyle.Short)
),

new ActionRowBuilder().addComponents(
new TextInputBuilder()
.setCustomId("tw")
.setLabel("TW bakmayı biliyor musun?")
.setStyle(TextInputStyle.Short)
)

);

interaction.showModal(modal);

}

/* VIP BAŞVURU */

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
.setLabel("SW deki süreniz")
.setStyle(TextInputStyle.Short)
)

);

interaction.showModal(modal);

}

/* TICKET KAPAT */

if(interaction.customId === "kapat"){

const channel = interaction.channel;

const messages = await channel.messages.fetch({limit:100});

let text = "";

messages.reverse().forEach(m=>{
text += `${m.author.tag}: ${m.content}\n`;
});

const buffer = Buffer.from(text,"utf8");

const log = await client.channels.fetch(logKanal);

log.send({
content:`Ticket kapatıldı\nKapatan Yetkili: ${interaction.user}`,
files:[{attachment:buffer,name:"ticket.txt"}]
});

interaction.reply({content:"Ticket kapatılıyor...",ephemeral:true});

setTimeout(()=>{
channel.delete();
},3000);

}

}

/* MODAL SUBMIT */

if(interaction.isModalSubmit()){

let kategori;
let isim;

if(interaction.customId === "oneriModal"){
sayac.oneri++;
kategori = destekKategori;
isim = `öneri-${sayac.oneri}`;
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

const channel = await interaction.guild.channels.create({
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

const closeButton = new ActionRowBuilder().addComponents(
new ButtonBuilder()
.setCustomId("kapat")
.setLabel("Ticket Kapat")
.setStyle(ButtonStyle.Danger)
);

channel.send({
content:`Talep sahibi: ${interaction.user}`,
components:[closeButton]
});

interaction.reply({
content:`Talebiniz oluşturuldu: ${channel}`,
ephemeral:true
});

}

});

client.login(process.env.TOKEN);