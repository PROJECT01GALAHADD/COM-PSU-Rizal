'use client'

import type React from 'react'
import { useRef, useEffect } from 'react'
import './Lightning.css'

interface LightningProps {
  hue?: number
  xOffset?: number
  speed?: number
  intensity?: number
  size?: number
}

const Lightning: React.FC<LightningProps> = ({
  hue = 230,
  xOffset = 0,
  speed = 1,
  intensity = 1,
  size = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      // avoid zero-sized canvas which can cause shader problems
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth))
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight))
    }
    // variables that need to be cleaned up from any early exit
    let rafId: number | null = null
    let fallbackInterval: number | null = null

    const safeCleanup = () => {
      window.removeEventListener('resize', resizeCanvas)
      if (fallbackInterval) window.clearInterval(fallbackInterval)
      if (rafId) cancelAnimationFrame(rafId)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const gl = canvas.getContext('webgl')
    const preferReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = (navigator as any).connection
      ? !!(navigator as any).connection.saveData
      : false

    if (!gl) {
      // Fallback: draw a lightweight animated gradient on 2D canvas when WebGL isn't available.
      const ctx2d = canvas.getContext('2d')
      if (!ctx2d) {
        console.error('No 2D context available for fallback animation')
        safeCleanup()
        return
      }
      // reuse outer fallbackInterval variable
      const drawFallback = (t: number) => {
        const w = canvas.width
        const h = canvas.height
        ctx2d.clearRect(0, 0, w, h)
        const g = ctx2d.createLinearGradient(0, 0, w, h)
        const tNorm = (t / 1000) % 1
        g.addColorStop(
          0,
          `hsla(${(hue + tNorm * 60) % 360}, 70%, 50%, ${0.65 * intensity})`
        )
        g.addColorStop(
          1,
          `hsla(${(hue + 180 + tNorm * 60) % 360}, 70%, 30%, ${0.3 * intensity})`
        )
        ctx2d.fillStyle = g
        ctx2d.fillRect(0, 0, w, h)
      }

      if (!preferReducedMotion && !saveData) {
        // run a low-cost animation at ~20fps
        fallbackInterval = window.setInterval(
          () => drawFallback(performance.now()),
          50
        )
      } else {
        // single static draw for reduced motion / save-data
        drawFallback(performance.now())
      }
      return () => {
        safeCleanup()
      }
    }

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHue;
      uniform float uXOffset;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;
      
      #define OCTAVE_COUNT 10

      vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return c.z * mix(vec3(1.0), rgb, c.y);
      }

      float hash11(float p) {
          p = fract(p * .1031);
          p *= p + 33.33;
          p *= p + p;
          return fract(p);
      }

      float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * .1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
      }

      mat2 rotate2d(float theta) {
          float c = cos(theta);
          float s = sin(theta);
          return mat2(c, -s, s, c);
      }

      float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 fp = fract(p);
          float a = hash12(ip);
          float b = hash12(ip + vec2(1.0, 0.0));
          float c = hash12(ip + vec2(0.0, 1.0));
          float d = hash12(ip + vec2(1.0, 1.0));
          
          vec2 t = smoothstep(0.0, 1.0, fp);
          return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }

      float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < OCTAVE_COUNT; ++i) {
              value += amplitude * noise(p);
              p *= rotate2d(0.45);
              p *= 2.0;
              amplitude *= 0.5;
          }
          return value;
      }

      void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
          vec2 uv = fragCoord / iResolution.xy;
          uv = 2.0 * uv - 1.0;
          uv.x *= iResolution.x / iResolution.y;
          uv.x += uXOffset;
          
          uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
          
          float dist = abs(uv.x);
          vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
          vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
          col = pow(col, vec3(1.0));
          fragColor = vec4(col, 1.0);
      }

      void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `

    const compileShader = (
      source: string,
      type: number
    ): WebGLShader | null => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER)
    const fragmentShader = compileShader(
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    )
    if (!vertexShader || !fragmentShader) {
      console.error('Shader compilation failed')
      safeCleanup()
      return
    }

    const program = gl.createProgram()
    if (!program) {
      console.error('Failed to create GL program')
      safeCleanup()
      return
    }
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ])
    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const aPosition = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    const iResolutionLocation = gl.getUniformLocation(program, 'iResolution')
    const iTimeLocation = gl.getUniformLocation(program, 'iTime')
    const uHueLocation = gl.getUniformLocation(program, 'uHue')
    const uXOffsetLocation = gl.getUniformLocation(program, 'uXOffset')
    const uSpeedLocation = gl.getUniformLocation(program, 'uSpeed')
    const uIntensityLocation = gl.getUniformLocation(program, 'uIntensity')
    const uSizeLocation = gl.getUniformLocation(program, 'uSize')

    // Respect user preferences and conserve CPU/GPU when appropriate
    const preferReduced = preferReducedMotion || saveData
    const fpsLimit = preferReduced ? 12 : 60 // use 60fps when not reduced-motion/save-data for smooth visuals

    const startTime = performance.now()
    let lastFrameTime = startTime

    const loop = (now: number) => {
      // pause when tab is hidden
      if (document.hidden) {
        rafId = requestAnimationFrame(loop)
        return
      }

      const delta = now - lastFrameTime
      const minDelta = 1000 / fpsLimit
      if (delta >= minDelta) {
        resizeCanvas()
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.uniform2f(iResolutionLocation, canvas.width, canvas.height)
        gl.uniform1f(iTimeLocation, (now - startTime) / 1000.0)
        gl.uniform1f(uHueLocation, hue)
        gl.uniform1f(uXOffsetLocation, xOffset)
        gl.uniform1f(uSpeedLocation, speed)
        gl.uniform1f(uIntensityLocation, intensity)
        gl.uniform1f(uSizeLocation, size)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
        lastFrameTime = now
      }
      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)

    return () => {
      safeCleanup()
      try {
        // try to release GL resources
        if (gl && gl.getExtension) {
          const ext = gl.getExtension('WEBGL_lose_context') as any
          if (ext && ext.loseContext) ext.loseContext()
        }
      } catch (e) {
        // ignore
      }
    }
  }, [hue, xOffset, speed, intensity, size])

  return <canvas ref={canvasRef} className="lightning-container" />
}

export default Lightning
