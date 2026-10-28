package com.change360.app.poster

import android.content.ContentValues
import android.content.Context
import android.graphics.*
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import androidx.core.content.FileProvider
import com.change360.app.data.model.AwarenessCategory
import com.change360.app.data.model.PosterType
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.io.OutputStream

data class PosterData(
    val title: String,
    val subtitle: String,
    val callToAction: String,
    val bullets: List<String>,
    val category: AwarenessCategory,
    val posterType: PosterType = PosterType.CUSTOM_AWARENESS,
    val templateName: String = "vibrant_eco",
    val authorOrOrgName: String = "CHANGE360 Changemaker",
    val impactStatHeadline: String? = null,
    val recordedActionsCount: Int = 0,
    val verifiedCount: Int = 0,
    val selfReportedCount: Int = 0
)

object PosterRenderer {

    /**
     * Renders a high-resolution 1080x1350 portrait poster bitmap on native Android Canvas.
     * Features automatic line wrapping, vibrant geometric overlays, sticker badges, and verifiable impact banners.
     */
    fun renderPosterBitmap(poster: PosterData): Bitmap {
        val width = 1080
        val height = 1350
        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)

        // 8 Visual Styles Palette Definition
        val (bgTop, bgBottom, accentPrimary, accentSecondary, innerCardColor, tagBg, tagText) = when (poster.templateName) {
            "vibrant_eco" -> Tuple7("#E8FDF3", "#C8F7DC", "#00E676", "#00897B", "#FFFFFF", "#D1FAE5", "#065F46")
            "bold_neon" -> Tuple7("#0F172A", "#1E1B4B", "#FF5A5F", "#00E676", "#1E293B", "#FEF3C7", "#92400E")
            "clean_minimal" -> Tuple7("#F8FAFC", "#F1F5F9", "#00897B", "#475569", "#FFFFFF", "#E0F2FE", "#0369A1")
            "infographic" -> Tuple7("#EBF4FF", "#D0E7FF", "#00B0FF", "#6366F1", "#FFFFFF", "#EDE9FE", "#6D28D9")
            "community" -> Tuple7("#FFF7ED", "#FED7AA", "#FF5A5F", "#FFC107", "#FFFFFF", "#FEF3C7", "#B45309")
            "health" -> Tuple7("#ECFEFF", "#CFFAFE", "#0288D1", "#00E676", "#FFFFFF", "#E0F2FE", "#0284C7")
            "school" -> Tuple7("#F5F3FF", "#DDD6FE", "#7C3AED", "#FF5A5F", "#FFFFFF", "#EEF2FF", "#4F46E5")
            "personal_summary" -> Tuple7("#F0FDF4", "#DCFCE7", "#10B981", "#FFC107", "#FFFFFF", "#D1FAE5", "#065F46")
            else -> Tuple7("#E8FDF3", "#C8F7DC", "#00E676", "#00897B", "#FFFFFF", "#D1FAE5", "#065F46")
        }

        val isDark = poster.templateName == "bold_neon"

        // 1. Draw Background Gradient
        val bgPaint = Paint().apply {
            isAntiAlias = true
            shader = LinearGradient(
                0f, 0f, 0f, height.toFloat(),
                Color.parseColor(bgTop), Color.parseColor(bgBottom),
                Shader.TileMode.CLAMP
            )
        }
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), bgPaint)

        // Geometric vibrant accent shapes in background
        val decorPaint = Paint().apply {
            isAntiAlias = true
            color = Color.parseColor(accentPrimary)
            alpha = if (isDark) 40 else 25
        }
        canvas.drawCircle(980f, 160f, 240f, decorPaint)
        canvas.drawCircle(120f, 1220f, 200f, decorPaint)

        // 2. Main Inner Card Container
        val cardPaint = Paint().apply {
            isAntiAlias = true
            style = Paint.Style.FILL
            color = Color.parseColor(innerCardColor)
            setShadowLayer(40f, 0f, 20f, Color.argb(if (isDark) 140 else 40, 0, 0, 0))
        }
        val cardRect = RectF(60f, 90f, (width - 60).toFloat(), (height - 110).toFloat())
        canvas.drawRoundRect(cardRect, 44f, 44f, cardPaint)

        // Card Border
        val cardBorderPaint = Paint().apply {
            isAntiAlias = true
            style = Paint.Style.STROKE
            strokeWidth = 3f
            color = if (isDark) Color.parseColor("#334155") else Color.parseColor("#E2E8F0")
        }
        canvas.drawRoundRect(cardRect, 44f, 44f, cardBorderPaint)

        val textColorPrimary = if (isDark) Color.WHITE else Color.parseColor("#0F172A")
        val textColorSecondary = if (isDark) Color.parseColor("#94A3B8") else Color.parseColor("#475569")

        // 3. Category Sticker Tag Badge
        val tagBgPaint = Paint().apply {
            isAntiAlias = true
            style = Paint.Style.FILL
            color = Color.parseColor(tagBg)
        }
        val tagRect = RectF(110f, 140f, 560f, 204f)
        canvas.drawRoundRect(tagRect, 22f, 22f, tagBgPaint)

        val tagTextPaint = Paint().apply {
            isAntiAlias = true
            color = Color.parseColor(tagText)
            textSize = 24f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }
        canvas.drawText(poster.category.displayName.uppercase(), 135f, 180f, tagTextPaint)

        // Poster Type Badge
        val typePaint = Paint().apply {
            isAntiAlias = true
            color = Color.parseColor(accentSecondary)
            textSize = 21f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }
        canvas.drawText(poster.posterType.displayName.uppercase(), 590f, 180f, typePaint)

        // 4. Headline (Automatic Multi-line Word Wrapped)
        val titlePaint = Paint().apply {
            isAntiAlias = true
            color = textColorPrimary
            textSize = 58f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }
        val titleBottomY = drawMultilineText(
            canvas = canvas,
            text = poster.title,
            x = 110f,
            startY = 270f,
            paint = titlePaint,
            maxWidth = width - 220f,
            lineSpacing = 68f
        )

        // 5. Subtitle (Multi-line Word Wrapped)
        val subtitlePaint = Paint().apply {
            isAntiAlias = true
            color = textColorSecondary
            textSize = 30f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
        }
        val subtitleBottomY = drawMultilineText(
            canvas = canvas,
            text = poster.subtitle,
            x = 110f,
            startY = titleBottomY + 36f,
            paint = subtitlePaint,
            maxWidth = width - 220f,
            lineSpacing = 42f
        )

        // 6. Action Bullets Box
        val boxStartY = subtitleBottomY + 40f
        val boxHeight = 280f
        val boxPaint = Paint().apply {
            isAntiAlias = true
            style = Paint.Style.FILL
            color = if (isDark) Color.parseColor("#0F172A") else Color.parseColor("#F8FAFC")
        }
        val boxRect = RectF(110f, boxStartY, (width - 110).toFloat(), boxStartY + boxHeight)
        canvas.drawRoundRect(boxRect, 28f, 28f, boxPaint)

        val boxBorder = Paint().apply {
            isAntiAlias = true
            style = Paint.Style.STROKE
            strokeWidth = 2f
            color = if (isDark) Color.parseColor("#334155") else Color.parseColor("#E2E8F0")
        }
        canvas.drawRoundRect(boxRect, 28f, 28f, boxBorder)

        val boxHeaderPaint = Paint().apply {
            isAntiAlias = true
            color = textColorPrimary
            textSize = 26f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }
        canvas.drawText("PRACTICAL ACTION ROADMAP:", 145f, boxStartY + 50f, boxHeaderPaint)

        var bulletY = boxStartY + 105f
        val bulletDotPaint = Paint().apply {
            isAntiAlias = true
            color = Color.parseColor(accentPrimary)
        }
        val bulletTextPaint = Paint().apply {
            isAntiAlias = true
            color = textColorPrimary
            textSize = 28f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)
        }

        for (bullet in poster.bullets.take(3)) {
            canvas.drawCircle(155f, bulletY - 9f, 9f, bulletDotPaint)
            drawMultilineText(
                canvas = canvas,
                text = bullet,
                x = 180f,
                startY = bulletY,
                paint = bulletTextPaint,
                maxWidth = width - 330f,
                lineSpacing = 36f
            )
            bulletY += 58f
        }

        // 7. Proof of Impact Banner (No Fabricated Stats)
        val impactStartY = boxStartY + boxHeight + 30f
        val impactBoxHeight = 85f
        val impactBoxPaint = Paint().apply {
            isAntiAlias = true
            style = Paint.Style.FILL
            color = if (poster.recordedActionsCount > 0) Color.parseColor("#F0FDF4") else Color.parseColor("#F8FAFC")
        }
        val impactRect = RectF(110f, impactStartY, (width - 110).toFloat(), impactStartY + impactBoxHeight)
        canvas.drawRoundRect(impactRect, 20f, 20f, impactBoxPaint)

        val impactBorder = Paint().apply {
            isAntiAlias = true
            style = Paint.Style.STROKE
            strokeWidth = 2f
            color = if (poster.recordedActionsCount > 0) Color.parseColor("#86EFAC") else Color.parseColor("#E2E8F0")
        }
        canvas.drawRoundRect(impactRect, 20f, 20f, impactBorder)

        val impactTitlePaint = Paint().apply {
            isAntiAlias = true
            color = if (poster.recordedActionsCount > 0) Color.parseColor("#166534") else Color.parseColor("#475569")
            textSize = 22f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }
        val impactSubPaint = Paint().apply {
            isAntiAlias = true
            color = if (poster.recordedActionsCount > 0) Color.parseColor("#15803D") else Color.parseColor("#64748B")
            textSize = 18f
        }

        if (poster.recordedActionsCount > 0) {
            canvas.drawText(
                "VERIFIED IMPACT: ${poster.recordedActionsCount} ACTIONS (${poster.verifiedCount} VERIFIED • ${poster.selfReportedCount} SELF-REPORTED)",
                140f, impactStartY + 36f, impactTitlePaint
            )
            canvas.drawText("Tracked transparently under CHANGE360 Proof of Impact Framework", 140f, impactStartY + 64f, impactSubPaint)
        } else {
            canvas.drawText("AWARENESS PLEDGE • ZERO FABRICATED METRICS", 140f, impactStartY + 36f, impactTitlePaint)
            canvas.drawText("Be the first changemaker in your area to log a verified contribution!", 140f, impactStartY + 64f, impactSubPaint)
        }

        // 8. Call To Action Button Banner
        val ctaY = impactStartY + impactBoxHeight + 35f
        val ctaPaint = Paint().apply {
            isAntiAlias = true
            style = Paint.Style.FILL
            shader = LinearGradient(
                110f, ctaY, (width - 110).toFloat(), ctaY + 95f,
                Color.parseColor(accentPrimary), Color.parseColor(accentSecondary),
                Shader.TileMode.CLAMP
            )
        }
        val ctaRect = RectF(110f, ctaY, (width - 110).toFloat(), ctaY + 95f)
        canvas.drawRoundRect(ctaRect, 26f, 26f, ctaPaint)

        val ctaTextPaint = Paint().apply {
            isAntiAlias = true
            color = Color.WHITE
            textSize = 34f
            textAlign = Paint.Align.CENTER
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }
        canvas.drawText(poster.callToAction.uppercase(), (width / 2).toFloat(), ctaY + 58f, ctaTextPaint)

        // 9. Footer Brand & Attribution
        val footerPaint = Paint().apply {
            isAntiAlias = true
            color = Color.parseColor("#94A3B8")
            textSize = 22f
            textAlign = Paint.Align.CENTER
        }
        canvas.drawText(
            "CHANGE360 • Learn. Act. Track. Inspire. • Created by ${poster.authorOrOrgName}",
            (width / 2).toFloat(), (height - 65).toFloat(), footerPaint
        )

        return bitmap
    }

    private fun drawMultilineText(
        canvas: Canvas,
        text: String,
        x: Float,
        startY: Float,
        paint: Paint,
        maxWidth: Float,
        lineSpacing: Float
    ): Float {
        var currentY = startY
        val words = text.split(" ")
        var currentLine = StringBuilder()

        for (word in words) {
            val testLine = if (currentLine.isEmpty()) word else "$currentLine $word"
            val textWidth = paint.measureText(testLine)
            if (textWidth > maxWidth && currentLine.isNotEmpty()) {
                canvas.drawText(currentLine.toString(), x, currentY, paint)
                currentY += lineSpacing
                currentLine = StringBuilder(word)
            } else {
                currentLine.append(if (currentLine.isEmpty()) word else " $word")
            }
        }
        if (currentLine.isNotEmpty()) {
            canvas.drawText(currentLine.toString(), x, currentY, paint)
        }
        return currentY
    }

    suspend fun saveBitmapToMediaStore(context: Context, bitmap: Bitmap, fileName: String): Uri? = withContext(Dispatchers.IO) {
        val resolver = context.contentResolver
        val contentValues = ContentValues().apply {
            put(MediaStore.MediaColumns.DISPLAY_NAME, "$fileName.png")
            put(MediaStore.MediaColumns.MIME_TYPE, "image/png")
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/CHANGE360")
                put(MediaStore.MediaColumns.IS_PENDING, 1)
            }
        }

        val uri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, contentValues) ?: return@withContext null
        try {
            val stream: OutputStream? = resolver.openOutputStream(uri)
            stream?.use { bitmap.compress(Bitmap.CompressFormat.PNG, 100, it) }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                contentValues.clear()
                contentValues.put(MediaStore.MediaColumns.IS_PENDING, 0)
                resolver.update(uri, contentValues, null, null)
            }
            uri
        } catch (e: Exception) {
            resolver.delete(uri, null, null)
            null
        }
    }

    suspend fun createShareableImageUri(context: Context, bitmap: Bitmap, fileName: String): Uri? = withContext(Dispatchers.IO) {
        try {
            val imagesFolder = File(context.cacheDir, "images")
            if (!imagesFolder.exists()) imagesFolder.mkdirs()
            val file = File(imagesFolder, "$fileName.png")
            val stream = FileOutputStream(file)
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)
            stream.flush()
            stream.close()

            FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", file)
        } catch (e: Exception) {
            null
        }
    }

    private data class Tuple7<A, B, C, D, E, F, G>(
        val a: A, val b: B, val c: C, val d: D, val e: E, val f: F, val g: G
    )
}
