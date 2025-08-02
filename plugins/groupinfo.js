async function groupInfoCommand(sock, chatId, msg) {
    try {
        // Get group metadata
        const groupMetadata = await sock.groupMetadata(chatId);
        
        // Get group profile picture
        let pp;
        try {
            pp = await sock.profilePictureUrl(chatId, 'image');
        } catch {
            pp = 'https://i.postimg.cc/029xmZVt/IMG-20250801-003906-211.jpg'; // Default image
        }

        // Get admins from participants
        const participants = groupMetadata.participants;
        const groupAdmins = participants.filter(p => p.admin);
        const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
        
        // Get group owner
        const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || chatId.split('-')[0] + '@s.whatsapp.net';

        // Create info text
        // ... (keep the initial code for fetching metadata and profile picture)

// Create info text with improved design
const text = `
🏰 *Group Information Center* 🏰
══════════════════════════════
🌐 *Group ID:* 
   ${groupMetadata.id.split('@')[0]}

📛 *Group Name:*
   ${groupMetadata.subject}

👥 *Membership:*
   ${participants.length} members (${groupAdmins.length} admins)

📅 *Created:* 
   ${new Date(groupMetadata.creation * 1000).toLocaleDateString('en-US', { 
       weekday: 'long', 
       year: 'numeric', 
       month: 'long', 
       day: 'numeric' 
   })}

👑 *Group Owner:*
   @${owner.split('@')[0]}

🛡️ *Administration Team:*
${groupAdmins.map((admin, index) => 
    `${index < 3 ? ['🥇','🥈','🥉'][index] : '▸'} @${admin.id.split('@')[0]}`
).join('\n')}

📜 *Group Description:*
┌───────────────────────────
│ ${(groupMetadata.desc?.toString() || 'No description set').replace(/\n/g, '\n│ ')}
└───────────────────────────

🔒 *Settings:*
   ${groupMetadata.restrict ? '🚫 Restricted Join' : '✅ Open Join'}
   ${groupMetadata.announce ? '📢 Announcement Group' : '💬 Discussion Group'}

══════════════════════════════
>ℹ️ ♧𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 NIMA♧ `.trim();

        // Send the message with image and mentions
        await sock.sendMessage(chatId, {
            image: { url: pp },
            caption: text,
            mentions: [...groupAdmins.map(v => v.id), owner]
        });

    } catch (error) {
        console.error('Error in groupinfo command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to get group info!' });
    }
}

module.exports = groupInfoCommand; 