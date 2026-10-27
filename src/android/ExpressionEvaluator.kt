package com.example.scientificcalculator.domain

import kotlin.math.*

enum class AngleMode {
    DEG, RAD
}

sealed class EvaluationResult {
    data class Success(val value: Double) : EvaluationResult()
    data class Error(val message: String) : EvaluationResult()
}

class ExpressionEvaluator {

    fun evaluate(expression: String, angleMode: AngleMode): EvaluationResult {
        if (expression.isBlank()) return EvaluationResult.Success(0.0)

        return try {
            val tokens = tokenize(expression)
            val rpn = shuntingYard(tokens)
            val result = evaluateRPN(rpn, angleMode)
            if (result.isNaN() || result.isInfinite()) {
                EvaluationResult.Error("Undefined")
            } else {
                EvaluationResult.Success(result)
            }
        } catch (e: ArithmeticException) {
            EvaluationResult.Error(e.message ?: "Math Error")
        } catch (e: Exception) {
            EvaluationResult.Error("Syntax Error")
        }
    }

    private sealed class Token {
        data class Number(val value: Double) : Token()
        data class Operator(val symbol: String, val precedence: Int, val rightAssociative: Boolean) : Token()
        data class Function(val name: String) : Token()
        object LeftParen : Token()
        object RightParen : Token()
        object ConstantPi : Token()
        object ConstantE : Token()
    }

    private fun tokenize(expr: String): List<Token> {
        val tokens = mutableListOf<Token>()
        var i = 0
        val sanitized = expr.replace("×", "*")
            .replace("÷", "/")
            .replace("−", "-")
            .replace("π", "PI")
            .replace("√", "sqrt")

        while (i < sanitized.length) {
            val c = sanitized[i]

            when {
                c.isWhitespace() -> i++

                c.isDigit() || c == '.' -> {
                    val sb = StringBuilder()
                    while (i < sanitized.length && (sanitized[i].isDigit() || sanitized[i] == '.')) {
                        sb.append(sanitized[i])
                        i++
                    }
                    tokens.add(Token.Number(sb.toString().toDouble()))
                }

                c == '(' -> {
                    // Check implicit multiplication e.g. 2(3) or pi(
                    if (tokens.isNotEmpty()) {
                        val last = tokens.last()
                        if (last is Token.Number || last is Token.RightParen || last is Token.ConstantPi || last is Token.ConstantE) {
                            tokens.add(Token.Operator("*", 2, false))
                        }
                    }
                    tokens.add(Token.LeftParen)
                    i++
                }

                c == ')' -> {
                    tokens.add(Token.RightParen)
                    i++
                }

                c == '+' || c == '-' || c == '*' || c == '/' || c == '%' || c == '^' || c == '!' -> {
                    val isUnaryMinus = (c == '-') && (tokens.isEmpty() ||
                            tokens.last() is Token.LeftParen ||
                            tokens.last() is Token.Operator)

                    if (isUnaryMinus) {
                        tokens.add(Token.Number(0.0))
                        tokens.add(Token.Operator("-", 2, false))
                    } else {
                        val prec = when (c) {
                            '+', '-' -> 1
                            '*', '/', '%' -> 2
                            '^' -> 3
                            '!' -> 4
                            else -> 1
                        }
                        val rightAssoc = (c == '^')
                        tokens.add(Token.Operator(c.toString(), prec, rightAssoc))
                    }
                    i++
                }

                c.isLetter() -> {
                    val sb = StringBuilder()
                    while (i < sanitized.length && sanitized[i].isLetter()) {
                        sb.append(sanitized[i])
                        i++
                    }
                    val name = sb.toString()
                    when (name.uppercase()) {
                        "PI" -> {
                            if (tokens.isNotEmpty() && (tokens.last() is Token.Number || tokens.last() is Token.RightParen)) {
                                tokens.add(Token.Operator("*", 2, false))
                            }
                            tokens.add(Token.ConstantPi)
                        }
                        "E" -> {
                            if (tokens.isNotEmpty() && (tokens.last() is Token.Number || tokens.last() is Token.RightParen)) {
                                tokens.add(Token.Operator("*", 2, false))
                            }
                            tokens.add(Token.ConstantE)
                        }
                        else -> {
                            if (tokens.isNotEmpty() && (tokens.last() is Token.Number || tokens.last() is Token.RightParen)) {
                                tokens.add(Token.Operator("*", 2, false))
                            }
                            tokens.add(Token.Function(name.lowercase()))
                        }
                    }
                }

                else -> i++
            }
        }
        return tokens
    }

    private fun shuntingYard(tokens: List<Token>): List<Token> {
        val output = mutableListOf<Token>()
        val stack = ArrayDeque<Token>()

        for (token in tokens) {
            when (token) {
                is Token.Number, is Token.ConstantPi, is Token.ConstantE -> output.add(token)
                is Token.Function -> stack.addLast(token)
                is Token.Operator -> {
                    while (stack.isNotEmpty()) {
                        val top = stack.last()
                        if (top is Token.Operator &&
                            ((!token.rightAssociative && token.precedence <= top.precedence) ||
                                    (token.rightAssociative && token.precedence < top.precedence))
                        ) {
                            output.add(stack.removeLast())
                        } else if (top is Token.Function) {
                            output.add(stack.removeLast())
                        } else {
                            break
                        }
                    }
                    stack.addLast(token)
                }
                is Token.LeftParen -> stack.addLast(token)
                is Token.RightParen -> {
                    while (stack.isNotEmpty() && stack.last() !is Token.LeftParen) {
                        output.add(stack.removeLast())
                    }
                    if (stack.isNotEmpty() && stack.last() is Token.LeftParen) {
                        stack.removeLast()
                    }
                    if (stack.isNotEmpty() && stack.last() is Token.Function) {
                        output.add(stack.removeLast())
                    }
                }
            }
        }

        while (stack.isNotEmpty()) {
            val top = stack.removeLast()
            if (top !is Token.LeftParen && top !is Token.RightParen) {
                output.add(top)
            }
        }

        return output
    }

    private fun evaluateRPN(tokens: List<Token>, angleMode: AngleMode): Double {
        val stack = ArrayDeque<Double>()

        for (token in tokens) {
            when (token) {
                is Token.Number -> stack.addLast(token.value)
                is Token.ConstantPi -> stack.addLast(PI)
                is Token.ConstantE -> stack.addLast(E)
                is Token.Operator -> {
                    if (token.symbol == "!") {
                        val a = stack.removeLastOrNull() ?: throw IllegalArgumentException("Invalid factorial")
                        stack.addLast(factorial(a))
                    } else {
                        val b = stack.removeLastOrNull() ?: throw IllegalArgumentException("Missing operand")
                        val a = stack.removeLastOrNull() ?: throw IllegalArgumentException("Missing operand")
                        val res = when (token.symbol) {
                            "+" -> a + b
                            "-" -> a - b
                            "*" -> a * b
                            "/" -> {
                                if (b == 0.0) throw ArithmeticException("Divide by zero")
                                a / b
                            }
                            "%" -> a % b
                            "^" -> a.pow(b)
                            else -> 0.0
                        }
                        stack.addLast(res)
                    }
                }
                is Token.Function -> {
                    val a = stack.removeLastOrNull() ?: throw IllegalArgumentException("Missing function arg")
                    val rad = if (angleMode == AngleMode.DEG) Math.toRadians(a) else a
                    val res = when (token.name) {
                        "sin" -> sin(rad)
                        "cos" -> cos(rad)
                        "tan" -> tan(rad)
                        "asin" -> {
                            val v = asin(a)
                            if (angleMode == AngleMode.DEG) Math.toDegrees(v) else v
                        }
                        "acos" -> {
                            val v = acos(a)
                            if (angleMode == AngleMode.DEG) Math.toDegrees(v) else v
                        }
                        "atan" -> {
                            val v = atan(a)
                            if (angleMode == AngleMode.DEG) Math.toDegrees(v) else v
                        }
                        "sinh" -> sinh(a)
                        "cosh" -> cosh(a)
                        "tanh" -> tanh(a)
                        "log", "log10" -> log10(a)
                        "ln" -> ln(a)
                        "sqrt" -> sqrt(a)
                        "cbrt" -> cbrt(a)
                        "abs" -> abs(a)
                        "exp" -> exp(a)
                        else -> throw IllegalArgumentException("Unknown function ${token.name}")
                    }
                    stack.addLast(res)
                }
                else -> {}
            }
        }

        return stack.removeLastOrNull() ?: 0.0
    }

    private fun factorial(n: Double): Double {
        if (n < 0 || n != floor(n)) throw ArithmeticException("Invalid Factorial")
        if (n > 170) throw ArithmeticException("Overflow")
        var result = 1.0
        for (i in 2..n.toInt()) {
            result *= i
        }
        return result
    }
}
