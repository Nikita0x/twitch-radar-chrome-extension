<template>
    <div style="width: 500px; height: 560px;">
        <h1 style="color: red;">Hello World. Counter is: {{ count }}</h1>
        <!-- Увеличим canvas до 400x300 для лучшего обзора -->
        <canvas ref="canvasRef" width="400" height="300"
            style="border: 1px solid #ccc; border-radius: 8px; margin: 10px 0; display: block;"></canvas>

        <TwitchLogin />
        <NotificationButton />
        <VueButton />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import VueButton from './components/VueButton.vue'
import NotificationButton from './components/NotificationButton.vue'
import TwitchLogin from './components/TwitchLogin.vue'

import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

const counterStore = useCounterStore()
const { count } = storeToRefs(counterStore)

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number

// 1. Вершинный шейдер (рисует прямоугольник на весь экран)
const vsSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

// 2. Фрагментный шейдер (рисует анимированную цветную плазму)
const fsSource = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Формула плазмы на основе синусов и косинусов от координат и времени
    float wave1 = sin(uv.x * 10.0 + u_time);
    float wave2 = cos(uv.y * 10.0 - u_time);
    float wave3 = sin((uv.x + uv.y) * 5.0 + u_time * 1.5);
    
    float r = 0.5 + 0.5 * wave1;
    float g = 0.5 + 0.5 * wave2;
    float b = 0.5 + 0.5 * wave3;
    
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`

// Вспомогательная функция для компиляции шейдеров
function createShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Ошибка компиляции шейдера:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
    }
    return shader
}

onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return

    // Инициализируем WebGL
    const gl = canvas.getContext('webgl')
    if (!gl) {
        console.error('WebGL не поддерживается вашим браузером')
        return
    }

    // Создаем и компилируем шейдеры
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource)
    if (!vertexShader || !fragmentShader) return

    // Создаем программу и связываем шейдеры
    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Ошибка линковки программы:', gl.getProgramInfoLog(program))
        return
    }

    gl.useProgram(program)

    // Создаем прямоугольник из двух треугольников на весь экран
    const vertices = new Float32Array([
        -1.0, -1.0,
        1.0, -1.0,
        -1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        1.0, 1.0,
    ])

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Получаем ссылки на юниформы (переменные времени и разрешения)
    const timeLocation = gl.getUniformLocation(program, 'u_time')
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')

    const startTime = performance.now()

    function render() {
        if (!gl || !canvas) return

        // Настраиваем вьюпорт под размеры canvas
        gl.viewport(0, 0, canvas.width, canvas.height)

        // Передаем текущее время (в секундах) и разрешение в шейдер
        const currentTime = (performance.now() - startTime) / 1000
        gl.uniform1f(timeLocation, currentTime)
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height)

        // Отрисовываем геометрию
        gl.drawArrays(gl.TRIANGLES, 0, 6)

        // Запрашиваем следующий кадр
        animationFrameId = requestAnimationFrame(render)
    }

    render()
})

onUnmounted(() => {
    cancelAnimationFrame(animationFrameId)
})
</script>